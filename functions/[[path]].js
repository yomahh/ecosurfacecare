const staticPublicRoutes = new Set([
  "/",
  "/services",
  "/our-work",
  "/about",
  "/faq",
  "/contact",
  "/request-a-quote",
  "/privacy",
  "/cookies",
  "/terms",
  "/accessibility",

  /*
   * Admin SPA routes.
   * Cloudflare Access protects these
   * before the React app is served.
   */
  "/admin",
  "/admin/dashboard",
  "/admin/gallery",

  /*
   * Development route currently
   * present in App.jsx.
   */
  "/ui-kit",

  /*
   * Legacy React route.
   */
  "/gallery",
]);

const serviceRoutes = new Set([
  "/services/grout-cleaning",
  "/services/grout-recolouring",
  "/services/biosteam-cleaning",
  "/services/surface-restoration",
  "/services/bathroom-restoration",
  "/services/kitchen-restoration",
  "/services/floor-maintenance",
  "/services/commercial-cleaning",
]);

function looksLikeStaticAsset(pathname) {
  return (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/videos/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/apple-touch-icon.png" ||
    pathname === "/robots.txt"
  );
}

async function publishedProjectExists(
  pathname,
  env,
) {
  const prefix =
    "/our-work/";

  if (
    !pathname.startsWith(prefix)
  ) {
    return false;
  }

  const slug =
    decodeURIComponent(
      pathname.slice(
        prefix.length,
      ),
    ).trim();

  if (
    !slug ||
    slug.includes("/")
  ) {
    return false;
  }

  if (!env.ecosurfacecare_db) {
    /*
     * Fail open if D1 is unexpectedly
     * unavailable so a temporary DB
     * problem does not turn valid project
     * pages into 404 responses.
     */
    return true;
  }

  try {
    const project =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT id
            FROM gallery_projects
            WHERE
              slug = ?
              AND status = 'published'
            LIMIT 1
          `,
        )
        .bind(slug)
        .first();

    return Boolean(project);
  } catch (error) {
    console.error(
      "Project route validation error:",
      error,
    );

    return true;
  }
}

function withStatus(
  response,
  status,
) {
  return new Response(
    response.body,
    {
      status,
      statusText:
        status === 404
          ? "Not Found"
          : response.statusText,

      headers:
        response.headers,
    },
  );
}

export async function onRequest(
  context,
) {
  const {
    request,
    env,
  } = context;

  const url =
    new URL(request.url);

  const pathname =
    url.pathname.length > 1
      ? url.pathname.replace(
          /\/+$/,
          "",
        )
      : "/";

  /*
   * Let actual static assets continue
   * through Cloudflare Pages normally.
   */
  if (
    looksLikeStaticAsset(
      pathname,
    )
  ) {
    return context.next();
  }

  /*
   * Known fixed React routes.
   */
  if (
    staticPublicRoutes.has(
      pathname,
    )
  ) {
    return context.next();
  }

  /*
   * Known service-detail routes.
   */
  if (
    serviceRoutes.has(
      pathname,
    )
  ) {
    return context.next();
  }

  /*
   * Individual published project pages.
   */
  if (
    await publishedProjectExists(
      pathname,
      env,
    )
  ) {
    return context.next();
  }

  /*
   * Any other route still receives the
   * React index shell so your existing
   * NotFound component can render,
   * but the HTTP status is changed to
   * a real 404.
   */
  const response =
    await context.next();

  return withStatus(
    response,
    404,
  );
}
