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

export async function onRequestDelete(context) {
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
            "Enquiry database is not configured.",
        },
        500,
      );
    }

    if (!env.QUOTE_IMAGES) {
      return json(
        {
          success: false,
          message:
            "Quote image storage is not configured.",
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
          message:
            "Quote reference is required.",
        },
        400,
      );
    }

    const quote =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT id, reference
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
          message:
            "Enquiry not found.",
        },
        404,
      );
    }

    /*
     * Remove private customer uploads first.
     */
    const prefix =
      `quotes/${reference}/`;

    let cursor;

    do {
      const listed =
        await env.QUOTE_IMAGES.list({
          prefix,
          cursor,
        });

      if (listed.objects.length > 0) {
        await env.QUOTE_IMAGES.delete(
          listed.objects.map(
            (object) => object.key,
          ),
        );
      }

      cursor =
        listed.truncated
          ? listed.cursor
          : undefined;
    } while (cursor);

    /*
     * Remove notes explicitly.
     */
    await env.ecosurfacecare_db
      .prepare(
        `
          DELETE FROM quote_notes
          WHERE quote_id = ?
        `,
      )
      .bind(quote.id)
      .run();

    /*
     * gallery_projects.quote_id uses
     * ON DELETE SET NULL, so public gallery
     * projects can remain independently.
     */
    await env.ecosurfacecare_db
      .prepare(
        `
          UPDATE gallery_projects
          SET quote_id = NULL
          WHERE quote_id = ?
        `,
      )
      .bind(quote.id)
      .run();

    await env.ecosurfacecare_db
      .prepare(
        `
          DELETE FROM quotes
          WHERE id = ?
        `,
      )
      .bind(quote.id)
      .run();

    return json({
      success: true,
      deleted_reference:
        reference,
    });
  } catch (error) {
    console.error(
      "Admin enquiry delete error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to delete enquiry.",
      },
      500,
    );
  }
}
