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

export async function onRequestGet(context) {
  try {
    const { request, env, params } = context;

    const access = await verifyAccess(request, env);

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
          message: "Enquiry database is not configured.",
        },
        500,
      );
    }

    const reference = String(params.reference || "").trim();

    if (!reference) {
      return json(
        {
          success: false,
          message: "Quote reference is required.",
        },
        400,
      );
    }

    const quote = await env.ecosurfacecare_db
      .prepare(
        `
          SELECT id
          FROM quotes
          WHERE reference = ?
          LIMIT 1
        `,
      )
      .bind(reference)
      .first();

    if (!quote) {
      return json(
        {
          success: false,
          message: "Enquiry not found.",
        },
        404,
      );
    }

    const { results } = await env.ecosurfacecare_db
      .prepare(
        `
          SELECT
            id,
            note,
            author_email,
            created_at,
            updated_at
          FROM quote_notes
          WHERE quote_id = ?
          ORDER BY datetime(created_at) DESC, id DESC
        `,
      )
      .bind(quote.id)
      .all();

    return json({
      success: true,
      reference,
      notes: results || [],
    });
  } catch (error) {
    console.error("Admin notes load error:", error);

    return json(
      {
        success: false,
        message: "Unable to load enquiry notes.",
      },
      500,
    );
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env, params } = context;

    const access = await verifyAccess(request, env);

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
          message: "Enquiry database is not configured.",
        },
        500,
      );
    }

    const reference = String(params.reference || "").trim();

    const body = await request.json();

    const note = String(body.note || "").trim();

    if (!reference) {
      return json(
        {
          success: false,
          message: "Quote reference is required.",
        },
        400,
      );
    }

    if (!note) {
      return json(
        {
          success: false,
          message: "Please enter a note.",
        },
        400,
      );
    }

    if (note.length > 5000) {
      return json(
        {
          success: false,
          message: "The note is too long.",
        },
        400,
      );
    }

    const quote = await env.ecosurfacecare_db
      .prepare(
        `
          SELECT id
          FROM quotes
          WHERE reference = ?
          LIMIT 1
        `,
      )
      .bind(reference)
      .first();

    if (!quote) {
      return json(
        {
          success: false,
          message: "Enquiry not found.",
        },
        404,
      );
    }

    const authorEmail = String(
      access.user.email || "",
    ).trim();

    const result = await env.ecosurfacecare_db
      .prepare(
        `
          INSERT INTO quote_notes (
            quote_id,
            note,
            author_email
          )
          VALUES (?, ?, ?)
        `,
      )
      .bind(
        quote.id,
        note,
        authorEmail || null,
      )
      .run();

    await env.ecosurfacecare_db
      .prepare(
        `
          UPDATE quotes
          SET updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
      )
      .bind(quote.id)
      .run();

    return json(
      {
        success: true,
        note: {
          id: result.meta.last_row_id,
          note,
          author_email: authorEmail || null,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Admin note creation error:", error);

    return json(
      {
        success: false,
        message: "Unable to save note.",
      },
      500,
    );
  }
}
