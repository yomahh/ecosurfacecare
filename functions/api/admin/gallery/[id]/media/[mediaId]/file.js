import { verifyAccess } from "../../../../../../_utils/access";

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

    /*
     * Protect draft/private gallery media
     * behind Cloudflare Access.
     */
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

    /*
     * Make sure D1 exists.
     */
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

    /*
     * Make sure R2 exists.
     */
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

    /*
     * Confirm the media belongs to the
     * requested gallery project.
     */
    const media =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              gm.id,
              gm.project_id,
              gm.r2_key,
              gm.filename,
              gm.content_type,
              gm.media_type

            FROM gallery_media gm

            INNER JOIN gallery_projects gp
              ON gp.id = gm.project_id

            WHERE
              gm.id = ?
              AND gm.project_id = ?

            LIMIT 1
          `,
        )
        .bind(
          mediaId,
          projectId,
        )
        .first();

    if (!media) {
      return new Response(
        "Not found",
        {
          status: 404,
          headers: {
            "Cache-Control":
              "no-store, private",
          },
        },
      );
    }

    /*
     * Retrieve the actual media object
     * from R2.
     */
    const object =
      await env.QUOTE_IMAGES.get(
        media.r2_key,
      );

    if (!object) {
      console.error(
        "Admin gallery R2 object missing:",
        media.r2_key,
      );

      return new Response(
        "Not found",
        {
          status: 404,
          headers: {
            "Cache-Control":
              "no-store, private",
          },
        },
      );
    }

    const headers =
      new Headers();

    /*
     * Prefer R2's stored MIME type.
     */
    const contentType =
      object.httpMetadata
        ?.contentType ||
      media.content_type ||
      "application/octet-stream";

    headers.set(
      "Content-Type",
      contentType,
    );

    /*
     * Admin previews should not be cached
     * publicly because draft gallery media
     * may be private.
     */
    headers.set(
      "Cache-Control",
      "no-store, private",
    );

    headers.set(
      "X-Content-Type-Options",
      "nosniff",
    );

    /*
     * Display media inline in the browser
     * rather than forcing a download.
     */
    const safeFilename =
      String(
        media.filename ||
          `gallery-media-${mediaId}`,
      ).replaceAll('"', "");

    headers.set(
      "Content-Disposition",
      `inline; filename="${safeFilename}"`,
    );

    /*
     * Advertise range support for video.
     *
     * We can implement full byte-range
     * handling later if needed.
     */
    if (
      media.media_type === "video"
    ) {
      headers.set(
        "Accept-Ranges",
        "bytes",
      );
    }

    return new Response(
      object.body,
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error(
      "Admin gallery media preview error:",
      error,
    );

    return new Response(
      "Unable to load media.",
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, private",
        },
      },
    );
  }
}
