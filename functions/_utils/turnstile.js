export async function verifyTurnstile({
  token,
  secret,
  request,
}) {
  if (!secret) {
    console.error(
      "TURNSTILE_SECRET is not configured.",
    );

    return {
      success: false,
      reason: "missing-secret",
    };
  }

  if (!token) {
    return {
      success: false,
      reason: "missing-token",
    };
  }

  const verificationData = new FormData();

  verificationData.append(
    "secret",
    secret,
  );

  verificationData.append(
    "response",
    token,
  );

  const remoteIp =
    request.headers.get(
      "CF-Connecting-IP",
    );

  if (remoteIp) {
    verificationData.append(
      "remoteip",
      remoteIp,
    );
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: verificationData,
    },
  );

  if (!response.ok) {
    console.error(
      "Turnstile Siteverify request failed:",
      response.status,
    );

    return {
      success: false,
      reason: "siteverify-error",
    };
  }

  const result = await response.json();

  if (!result.success) {
    console.warn(
      "Turnstile validation failed:",
      result["error-codes"],
    );
  }

  return result;
}
