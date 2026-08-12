function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export async function onRequestGet(context) {
  try {
    const {
      env,
      params,
      request,
    } = context;

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

    const mediaId = Number(
      params.mediaId,
    );

    if (
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
     * Only media belonging to a published
     * gallery project may be served publicly.
     */
    const media =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              gm.id,
              gm.r2_key,
              gm.filename,
              gm.content_type,
              gm.media_type,
              gp.status

            FROM gallery_media gm

            INNER JOIN gallery_projects gp
              ON gp.id = gm.project_id

            WHERE
              gm.id = ?
              AND gp.status = 'published'

            LIMIT 1
          `,
        )
        .bind(mediaId)
        .first();

    if (!media) {
      return new Response(
        "Not found",
        {
          status: 404,
          headers: {
            "Cache-Control":
              "public, max-age=60",
          },
        },
      );
    }

    const object =
      await env.QUOTE_IMAGES.get(
        media.r2_key,
      );

    if (!object) {
      console.error(
        "Gallery R2 object missing:",
        media.r2_key,
      );

      return new Response(
        "Not found",
        {
          status: 404,
        },
      );
    }

    const headers =
      new Headers();

    /*
     * Prefer the content type stored in
     * R2 metadata, then fall back to D1.
     */
    if (
      object.httpMetadata
        ?.contentType
    ) {
      headers.set(
        "Content-Type",
        object.httpMetadata
          .contentType,
      );
    } else if (
      media.content_type
    ) {
      headers.set(
        "Content-Type",
        media.content_type,
      );
    } else {
      headers.set(
        "Content-Type",
        "application/octet-stream",
      );
    }

    /*
     * Public gallery media can be cached.
     */
    headers.set(
      "Cache-Control",
      "public, max-age=86400, stale-while-revalidate=604800",
    );

    headers.set(
      "X-Content-Type-Options",
      "nosniff",
    );

    /*
     * Support browser range requests for
     * videos and larger media files.
     */
    const range =
      request.headers.get("Range");

    if (
      range &&
      media.media_type === "video"
    ) {
      /*
       * Keep the initial implementation
       * simple: R2's Response body will still
       * stream efficiently, but we don't
       * manually implement byte ranges here.
       *
       * We can add full range support later
       * if needed.
       */
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
      "Public gallery media error:",
      error,
    );

    return new Response(
      "Unable to load media.",
      {
        status: 500,
      },
    );
  }
}
