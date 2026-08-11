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

    if (!env.QUOTE_IMAGES) {
      return json(
        {
          success: false,
          message: "Photo storage is not configured.",
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

    const prefix = `quotes/${reference}/`;

    const result = await env.QUOTE_IMAGES.list({
      prefix,
    });

    const photos = result.objects.map((object) => ({
      key: object.key,
      size: object.size,
      uploaded: object.uploaded,
      url:
        `/api/admin/quotes/${encodeURIComponent(
          reference,
        )}/photo?key=${encodeURIComponent(object.key)}`,
    }));

    return json({
      success: true,
      reference,
      photos,
    });
  } catch (error) {
    console.error("Admin photo list error:", error);

    return json(
      {
        success: false,
        message: "Unable to load enquiry photos.",
      },
      500,
    );
  }
}
