function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=60, stale-while-revalidate=300",
    },
  });
}

export async function onRequestGet(context) {
  try {
    const { env } = context;

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

    const { results: projects } =
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

            WHERE status = 'published'

            ORDER BY
              datetime(
                COALESCE(
                  published_at,
                  created_at
                )
              ) DESC,
              id DESC
          `,
        )
        .all();

    if (
      !projects ||
      projects.length === 0
    ) {
      return json({
        success: true,
        projects: [],
      });
    }

    const projectIds =
      projects.map(
        (project) => project.id,
      );

    const placeholders =
      projectIds
        .map(() => "?")
        .join(",");

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

            WHERE project_id IN (
              ${placeholders}
            )

            ORDER BY
              project_id ASC,
              sort_order ASC,
              id ASC
          `,
        )
        .bind(...projectIds)
        .all();

    const mediaByProject =
      new Map();

    for (
      const item of media || []
    ) {
      if (
        !mediaByProject.has(
          item.project_id,
        )
      ) {
        mediaByProject.set(
          item.project_id,
          [],
        );
      }

      mediaByProject
        .get(item.project_id)
        .push({
          ...item,

          url:
            `/api/gallery/media/${item.id}`,
        });
    }

    const publicProjects =
      projects.map(
        (project) => ({
          ...project,

          media:
            mediaByProject.get(
              project.id,
            ) || [],
        }),
      );

    return json({
      success: true,
      projects: publicProjects,
    });
  } catch (error) {
    console.error(
      "Public gallery API error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to load gallery.",
      },
      500,
    );
  }
}
