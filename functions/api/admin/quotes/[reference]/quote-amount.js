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

    /*
     * The frontend sends pounds as text/number,
     * for example:
     *
     * 240
     * 240.00
     * 149.99
     *
     * We convert that to pence for D1.
     */
    const amount = Number(body.amount);

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return json(
        {
          success: false,
          message: "Please enter a valid quote amount.",
        },
        400,
      );
    }

    /*
     * Protect against unrealistic/accidental values.
     * £1,000,000 maximum is more than enough here.
     */
    if (amount > 1000000) {
      return json(
        {
          success: false,
          message: "The quote amount is too large.",
        },
        400,
      );
    }

    const amountPence = Math.round(
      amount * 100,
    );

    const existing = await env.ecosurfacecare_db
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
            quoted_amount_pence = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE reference = ?
        `,
      )
      .bind(
        amountPence,
        reference,
      )
      .run();

    return json({
      success: true,
      reference,
      quoted_amount_pence: amountPence,
    });
  } catch (error) {
    console.error(
      "Admin quote amount update error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to save the quote amount.",
      },
      500,
    );
  }
}
