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

    const url = new URL(request.url);

    const key = String(url.searchParams.get("key") || "").trim();

    if (!reference || !key) {
      return json(
        {
          success: false,
          message: "Invalid photo request.",
        },
        400,
      );
    }

    const expectedPrefix = `quotes/${reference}/`;

    if (!key.startsWith(expectedPrefix)) {
      return json(
        {
          success: false,
          message: "Access denied.",
        },
        403,
      );
    }

    const object = await env.QUOTE_IMAGES.get(key);

    if (!object) {
      return json(
        {
          success: false,
          message: "Photo not found.",
        },
        404,
      );
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);

    headers.set(
      "Cache-Control",
      "private, no-store",
    );

    headers.set(
      "Content-Disposition",
      "inline",
    );

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error("Admin photo response error:", error);

    return json(
      {
        success: false,
        message: "Unable to load photo.",
      },
      500,
    );
  }
}
