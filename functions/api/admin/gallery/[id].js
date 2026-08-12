import { verifyAccess } from "../../../_utils/access";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, private",
    },
  });
}

function normaliseStatus(value) {
  const status = String(value || "").trim();

  if (status === "draft") {
    return "draft";
  }

  if (status === "published") {
    return "published";
  }

  return null;
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

    const id = Number(params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
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
            SELECT
              gp.id,
              gp.quote_id,
              gp.title,
              gp.slug,
              gp.category,
              gp.location,
              gp.description,
              gp.status,
              gp.created_at,
              gp.updated_at,
              gp.published_at,

              q.reference AS quote_reference,
              q.name AS customer_name

            FROM gallery_projects gp

            LEFT JOIN quotes q
              ON q.id = gp.quote_id

            WHERE gp.id = ?

            LIMIT 1
          `,
        )
        .bind(id)
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
            WHERE project_id = ?
            ORDER BY
              sort_order ASC,
              id ASC
          `,
        )
        .bind(id)
        .all();

    return json({
      success: true,
      project: {
        ...project,
        media: media || [],
      },
    });
  } catch (error) {
    console.error(
      "Admin gallery project load error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to load gallery project.",
      },
      500,
    );
  }
}

export async function onRequestPatch(context) {
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

    const id = Number(params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
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

    const existing =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              id,
              title,
              category,
              location,
              description,
              status,
              published_at
            FROM gallery_projects
            WHERE id = ?
            LIMIT 1
          `,
        )
        .bind(id)
        .first();

    if (!existing) {
      return json(
        {
          success: false,
          message:
            "Gallery project not found.",
        },
        404,
      );
    }

    const body = await request.json();

    const title =
      body.title === undefined
        ? existing.title
        : String(body.title).trim();

    const category =
      body.category === undefined
        ? existing.category
        : String(body.category).trim();

    const location =
      body.location === undefined
        ? existing.location
        : String(body.location).trim();

    const description =
      body.description === undefined
        ? existing.description
        : String(body.description).trim();

    let status = existing.status;

    if (body.status !== undefined) {
      status = normaliseStatus(
        body.status,
      );

      if (!status) {
        return json(
          {
            success: false,
            message:
              "Status must be draft or published.",
          },
          400,
        );
      }
    }

    if (!title) {
      return json(
        {
          success: false,
          message:
            "Project title is required.",
        },
        400,
      );
    }

    if (!category) {
      return json(
        {
          success: false,
          message:
            "Project category is required.",
        },
        400,
      );
    }

    let publishedAt =
      existing.published_at;

    if (
      status === "published" &&
      existing.status !== "published"
    ) {
      publishedAt =
        new Date().toISOString();
    }

    if (status === "draft") {
      publishedAt = null;
    }

    await env.ecosurfacecare_db
      .prepare(
        `
          UPDATE gallery_projects
          SET
            title = ?,
            category = ?,
            location = ?,
            description = ?,
            status = ?,
            published_at = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
      )
      .bind(
        title,
        category,
        location || null,
        description || null,
        status,
        publishedAt,
        id,
      )
      .run();

    const project =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              id,
              quote_id,
              title,
              slug,
              category,
              location,
              description,
              status,
              created_at,
              updated_at,
              published_at
            FROM gallery_projects
            WHERE id = ?
            LIMIT 1
          `,
        )
        .bind(id)
        .first();

    return json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "Admin gallery project update error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to update gallery project.",
      },
      500,
    );
  }
}
