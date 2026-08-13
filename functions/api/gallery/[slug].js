function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json",
        "Cache-Control":
          "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}

export async function onRequestGet(
  context,
) {
  try {
    const {
      env,
      params,
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

    const slug = String(
      params.slug || "",
    ).trim();

    if (!slug) {
      return json(
        {
          success: false,
          message:
            "Project slug is required.",
        },
        400,
      );
    }

    /*
     * Only published projects are
     * available through the public API.
     */
    const project =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              id,
              title,
              slug,
              category,
              location,
              description,
              created_at,
              updated_at,
              published_at

            FROM gallery_projects

            WHERE
              slug = ?
              AND status = 'published'

            LIMIT 1
          `,
        )
        .bind(slug)
        .first();

    if (!project) {
      return json(
        {
          success: false,
          message:
            "Project not found.",
        },
        404,
      );
    }

    const { results: media } =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              id,
              project_id,
              filename,
              content_type,
              alt_text,
              sort_order,
              media_type,
              created_at

            FROM gallery_media

            WHERE project_id = ?

            ORDER BY
              sort_order ASC,
              id ASC
          `,
        )
        .bind(project.id)
        .all();

    const publicMedia =
      (media || []).map(
        (item) => ({
          ...item,

          url:
            `/api/gallery/media/${item.id}`,
        }),
      );

    return json({
      success: true,

      project: {
        ...project,
        media: publicMedia,
      },
    });
  } catch (error) {
    console.error(
      "Public gallery project API error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to load project.",
      },
      500,
    );
  }
}
