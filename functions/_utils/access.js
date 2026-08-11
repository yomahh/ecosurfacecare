import {
  createRemoteJWKSet,
  jwtVerify,
} from "jose";

let cachedJwks = null;
let cachedJwksUrl = null;

function getJwks(teamDomain) {
  const url =
    `${teamDomain}/cdn-cgi/access/certs`;

  if (
    !cachedJwks ||
    cachedJwksUrl !== url
  ) {
    cachedJwks =
      createRemoteJWKSet(new URL(url));

    cachedJwksUrl = url;
  }

  return cachedJwks;
}

export async function verifyAccess(
  request,
  env,
) {
  const teamDomain = String(
    env.TEAM_DOMAIN || "",
  )
    .trim()
    .replace(/\/+$/, "");

  const audience = String(
    env.POLICY_AUD || "",
  ).trim();

  if (!teamDomain || !audience) {
    console.error(
      "Cloudflare Access configuration is missing.",
    );

    return {
      success: false,
      status: 500,
      message:
        "Admin authentication is not configured.",
    };
  }

  const token =
    request.headers.get(
      "cf-access-jwt-assertion",
    );

  if (!token) {
    console.warn(
      "Admin request missing Cloudflare Access JWT.",
    );

    return {
      success: false,
      status: 403,
      message: "Access denied.",
    };
  }

  try {
    const jwks = getJwks(teamDomain);

    const { payload } =
      await jwtVerify(token, jwks, {
        issuer: teamDomain,
        audience,
      });

    return {
      success: true,
      user: payload,
    };
  } catch (error) {
    console.error(
      "Cloudflare Access JWT verification failed:",
      error instanceof Error
        ? error.message
        : error,
    );

    return {
      success: false,
      status: 403,
      message: "Access denied.",
    };
  }
}
