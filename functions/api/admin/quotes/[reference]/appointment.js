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

    const reference = String(
      params.reference || "",
    ).trim();

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

    const appointmentAt = String(
      body.appointment_at || "",
    ).trim();

    if (!appointmentAt) {
      return json(
        {
          success: false,
          message: "Appointment date and time are required.",
        },
        400,
      );
    }

    /*
     * Expect YYYY-MM-DDTHH:mm
     */
    const appointmentDate =
      new Date(appointmentAt);

    if (
      Number.isNaN(
        appointmentDate.getTime(),
      )
    ) {
      return json(
        {
          success: false,
          message: "Invalid appointment date or time.",
        },
        400,
      );
    }

    const existing =
      await env.ecosurfacecare_db
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

    /*
     * Store the value exactly as a local datetime string.
     * Example:
     * 2026-08-18T10:30
     */
    await env.ecosurfacecare_db
      .prepare(
        `
          UPDATE quotes
          SET
            appointment_at = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE reference = ?
        `,
      )
      .bind(
        appointmentAt,
        reference,
      )
      .run();

    return json({
      success: true,
      reference,
      appointment_at: appointmentAt,
    });
  } catch (error) {
    console.error(
      "Admin appointment update error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to save the appointment.",
      },
      500,
    );
  }
}
