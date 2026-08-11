import { verifyAccess } from "../../_utils/access";

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, private",
      },
    },
  );
}

export async function onRequestGet(
  context,
) {
  try {
    const { request, env } = context;

    /*
     * Verify Cloudflare Access identity
     * before touching D1.
     */
    const access =
      await verifyAccess(request, env);

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
     * Ensure D1 is available.
     */
    if (!env.ecosurfacecare_db) {
      console.error(
        "D1 binding ecosurfacecare_db is missing.",
      );

      return json(
        {
          success: false,
          message:
            "Enquiry database is not configured.",
        },
        500,
      );
    }

    /*
     * Return newest enquiries first.
     *
     * Limit protects the dashboard from
     * accidentally requesting an unlimited
     * number of records in future.
     */
    const { results } =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
          id,
          reference,
          name,
          email,
          phone,
          postcode,
          property_type,
          service,
          description,
          photo_count,
          status,
          quoted_amount_pence,
          appointment_at,
          created_at,
          updated_at
            FROM quotes
            ORDER BY
              datetime(created_at) DESC,
              id DESC
            LIMIT 100
          `,
        )
        .all();

    return json({
      success: true,

      user: {
        email:
          access.user.email || null,
      },

      quotes: results || [],
    });
  } catch (error) {
    console.error(
      "Admin quotes API error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to load enquiries.",
      },
      500,
    );
  }
}
