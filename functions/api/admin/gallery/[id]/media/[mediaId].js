import { verifyAccess } from "../../../../../_utils/access";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, private",
    },
  });
}

export async function onRequestGet(context) {
  try {
    const {
      request,
      env,
      params,
    } = context;

    const access = await verifyAccess(
      request,
      env,
    );

    if (!access.success) {
      return json(
        {
          success: false,
          message: access.message,
        },
        access.status,
      );
    }

    if (!env.ecosurfacecare_db) {
      return json(
        {
          success: false,
          message:
            "Gallery database is not configured.",
        },
        500,
      );
    }

    const projectId = Number(
      params.id,
    );

    const mediaId = Number(
      params.mediaId,
    );

    if (
      !Number.isInteger(projectId) ||
      projectId <= 0 ||
      !Number.isInteger(mediaId) ||
      mediaId <= 0
    ) {
      return json(
        {
          success: false,
          message:
            "Invalid gallery media ID.",
        },
        400,
      );
    }

    const media =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              id,
              project_id,
              r2_key,
              filename,
              content_type,
              alt_text,
              sort_order,
              created_at,
              media_type
            FROM gallery_media
            WHERE
              id = ?
              AND project_id = ?
            LIMIT 1
          `,
        )
        .bind(
          mediaId,
          projectId,
        )
        .first();

    if (!media) {
      return json(
        {
          success: false,
          message:
            "Gallery media not found.",
        },
        404,
      );
    }

    return json({
      success: true,
      media,
    });
  } catch (error) {
    console.error(
      "Admin gallery media load error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to load gallery media.",
      },
      500,
    );
  }
}

export async function onRequestDelete(
  context,
) {
  try {
    const {
      request,
      env,
      params,
    } = context;

    const access = await verifyAccess(
      request,
      env,
    );

    if (!access.success) {
      return json(
        {
          success: false,
          message: access.message,
        },
        access.status,
      );
    }

    if (!env.ecosurfacecare_db) {
      return json(
        {
          success: false,
          message:
            "Gallery database is not configured.",
        },
        500,
      );
    }

    if (!env.QUOTE_IMAGES) {
      return json(
        {
          success: false,
          message:
            "Gallery media storage is not configured.",
        },
        500,
      );
    }

    const projectId = Number(
      params.id,
    );

    const mediaId = Number(
      params.mediaId,
    );

    if (
      !Number.isInteger(projectId) ||
      projectId <= 0 ||
      !Number.isInteger(mediaId) ||
      mediaId <= 0
    ) {
      return json(
        {
          success: false,
          message:
            "Invalid gallery media ID.",
        },
        400,
      );
    }

    const media =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              id,
              project_id,
              r2_key
            FROM gallery_media
            WHERE
              id = ?
              AND project_id = ?
            LIMIT 1
          `,
        )
        .bind(
          mediaId,
          projectId,
        )
        .first();

    if (!media) {
      return json(
        {
          success: false,
          message:
            "Gallery media not found.",
        },
        404,
      );
    }

    /*
     * Delete from R2 first.
     *
     * If R2 deletion fails, we keep the
     * D1 row so the admin can try again.
     */
    try {
      await env.QUOTE_IMAGES.delete(
        media.r2_key,
      );
    } catch (storageError) {
      console.error(
        "Gallery media R2 delete failed:",
        media.r2_key,
        storageError,
      );

      return json(
        {
          success: false,
          message:
            "Unable to remove gallery media from storage.",
        },
        500,
      );
    }

    await env.ecosurfacecare_db
      .prepare(
        `
          DELETE FROM gallery_media
          WHERE
            id = ?
            AND project_id = ?
        `,
      )
      .bind(
        mediaId,
        projectId,
      )
      .run();

    await env.ecosurfacecare_db
      .prepare(
        `
          UPDATE gallery_projects
          SET
            updated_at =
              CURRENT_TIMESTAMP
          WHERE id = ?
        `,
      )
      .bind(projectId)
      .run();

    return json({
      success: true,
      deleted_media_id:
        mediaId,
    });
  } catch (error) {
    console.error(
      "Admin gallery media delete error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to delete gallery media.",
      },
      500,
    );
  }
}
