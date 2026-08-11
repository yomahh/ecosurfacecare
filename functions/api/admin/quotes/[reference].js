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

const allowedStatuses = new Set([
  "new",
  "contacted",
  "quoted",
  "booked",
  "completed",
  "cancelled",
]);

export async function onRequestPatch(context) {
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

    const body = await request.json();

    const status = String(body.status || "")
      .trim()
      .toLowerCase();

    if (!allowedStatuses.has(status)) {
      return json(
        {
          success: false,
          message: "Invalid enquiry status.",
        },
        400,
      );
    }

    const existing = await env.ecosurfacecare_db
      .prepare(
        `
          SELECT reference
          FROM quotes
          WHERE reference = ?
          LIMIT 1
        `,
      )
      .bind(reference)
      .first();

    if (!existing) {
      return json(
        {
          success: false,
          message: "Enquiry not found.",
        },
        404,
      );
    }

    await env.ecosurfacecare_db
      .prepare(
        `
          UPDATE quotes
          SET
            status = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE reference = ?
        `,
      )
      .bind(status, reference)
      .run();

    return json({
      success: true,
      reference,
      status,
    });
  } catch (error) {
    console.error("Admin status update error:", error);

    return json(
      {
        success: false,
        message: "Unable to update enquiry.",
      },
      500,
    );
  }
}
