import { verifyAccess } from "../../../../_utils/access";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, private",
    },
  });
}

export async function onRequestDelete(context) {
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

    if (
      !Number.isInteger(projectId) ||
      projectId <= 0
    ) {
      return json(
        {
          success: false,
          message:
            "Invalid gallery project ID.",
        },
        400,
      );
    }

    const project =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT id, title
            FROM gallery_projects
            WHERE id = ?
            LIMIT 1
          `,
        )
        .bind(projectId)
        .first();

    if (!project) {
      return json(
        {
          success: false,
          message:
            "Gallery project not found.",
        },
        404,
      );
    }

    const { results: media } =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT r2_key
            FROM gallery_media
            WHERE project_id = ?
          `,
        )
        .bind(projectId)
        .all();

    const keys =
      (media || [])
        .map((item) => item.r2_key)
        .filter(Boolean);

    if (keys.length > 0) {
      await env.QUOTE_IMAGES.delete(
        keys,
      );
    }

    await env.ecosurfacecare_db
      .prepare(
        `
          DELETE FROM gallery_media
          WHERE project_id = ?
        `,
      )
      .bind(projectId)
      .run();

    await env.ecosurfacecare_db
      .prepare(
        `
          DELETE FROM gallery_projects
          WHERE id = ?
        `,
      )
      .bind(projectId)
      .run();

    return json({
      success: true,
      deleted_project_id:
        projectId,
    });
  } catch (error) {
    console.error(
      "Admin gallery project delete error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to delete gallery project.",
      },
      500,
    );
  }
}
