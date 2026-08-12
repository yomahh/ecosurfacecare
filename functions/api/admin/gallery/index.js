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

function createSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function onRequestGet(context) {
  try {
    const { request, env } = context;

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

    const { results } =
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
              q.name AS customer_name,

              COUNT(gm.id) AS media_count

            FROM gallery_projects gp

            LEFT JOIN quotes q
              ON q.id = gp.quote_id

            LEFT JOIN gallery_media gm
              ON gm.project_id = gp.id

            GROUP BY gp.id

            ORDER BY
              datetime(gp.created_at) DESC,
              gp.id DESC
          `,
        )
        .all();

    return json({
      success: true,

      user: {
        email:
          access.user.email || null,
      },

      projects: results || [],
    });
  } catch (error) {
    console.error(
      "Admin gallery list error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to load gallery projects.",
      },
      500,
    );
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

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

    const body = await request.json();

    const title = String(
      body.title || "",
    ).trim();

    const category = String(
      body.category || "",
    ).trim();

    const location = String(
      body.location || "",
    ).trim();

    const description = String(
      body.description || "",
    ).trim();

    const quoteId =
      body.quote_id === null ||
      body.quote_id === undefined ||
      body.quote_id === ""
        ? null
        : Number(body.quote_id);

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

    if (
      quoteId !== null &&
      (!Number.isInteger(quoteId) ||
        quoteId <= 0)
    ) {
      return json(
        {
          success: false,
          message:
            "Invalid quote ID.",
        },
        400,
      );
    }

    if (quoteId !== null) {
      const quote =
        await env.ecosurfacecare_db
          .prepare(
            `
              SELECT id
              FROM quotes
              WHERE id = ?
              LIMIT 1
            `,
          )
          .bind(quoteId)
          .first();

      if (!quote) {
        return json(
          {
            success: false,
            message:
              "Linked enquiry was not found.",
          },
          404,
        );
      }
    }

    const baseSlug =
      createSlug(title);

    if (!baseSlug) {
      return json(
        {
          success: false,
          message:
            "Unable to create a valid project slug.",
        },
        400,
      );
    }

    let slug = baseSlug;
    let suffix = 2;

    while (true) {
      const existing =
        await env.ecosurfacecare_db
          .prepare(
            `
              SELECT id
              FROM gallery_projects
              WHERE slug = ?
              LIMIT 1
            `,
          )
          .bind(slug)
          .first();

      if (!existing) {
        break;
      }

      slug =
        `${baseSlug}-${suffix}`;

      suffix += 1;
    }

    const result =
      await env.ecosurfacecare_db
        .prepare(
          `
            INSERT INTO gallery_projects (
              quote_id,
              title,
              slug,
              category,
              location,
              description,
              status
            )
            VALUES (
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              'draft'
            )
          `,
        )
        .bind(
          quoteId,
          title,
          slug,
          category,
          location || null,
          description || null,
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
        .bind(
          result.meta.last_row_id,
        )
        .first();

    return json(
      {
        success: true,
        project,
      },
      201,
    );
  } catch (error) {
    console.error(
      "Admin gallery create error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to create gallery project.",
      },
      500,
    );
  }
}
