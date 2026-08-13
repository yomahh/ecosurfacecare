const SITE_URL =
  "https://ecosurfacecare.co.uk";

const staticPaths = [
  "/",
  "/services",
  "/services/grout-cleaning",
  "/services/grout-recolouring",
  "/services/biosteam-cleaning",
  "/services/surface-restoration",
  "/services/bathroom-restoration",
  "/services/kitchen-restoration",
  "/services/floor-maintenance",
  "/services/commercial-cleaning",
  "/our-work",
  "/about",
  "/faq",
  "/contact",
  "/request-a-quote",
];

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }

  return date
    .toISOString()
    .slice(0, 10);
}

function buildUrlEntry({
  loc,
  lastmod,
}) {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(
      loc,
    )}</loc>`,
  ];

  if (lastmod) {
    lines.push(
      `    <lastmod>${escapeXml(
        lastmod,
      )}</lastmod>`,
    );
  }

  lines.push("  </url>");

  return lines.join("\n");
}

export async function onRequestGet(
  context,
) {
  try {
    const { env } = context;

    /*
     * Permanent public pages.
     */
    const urls =
      staticPaths.map(
        (path) => ({
          loc:
            path === "/"
              ? `${SITE_URL}/`
              : `${SITE_URL}${path}`,
        }),
      );

    /*
     * Automatically get every
     * published project from D1.
     */
    if (env.ecosurfacecare_db) {
      const { results } =
        await env.ecosurfacecare_db
          .prepare(
            `
              SELECT
                slug,
                created_at,
                updated_at,
                published_at

              FROM gallery_projects

              WHERE status = 'published'

              ORDER BY
                datetime(
                  COALESCE(
                    published_at,
                    updated_at,
                    created_at
                  )
                ) DESC
            `,
          )
          .all();

      /*
       * Add each published project
       * to the sitemap.
       */
      for (
        const project of
          results || []
      ) {
        if (!project.slug) {
          continue;
        }

        urls.push({
          loc:
            `${SITE_URL}/our-work/${encodeURIComponent(
              project.slug,
            )}`,

          lastmod:
            formatDate(
              project.updated_at ||
                project.published_at ||
                project.created_at,
            ),
        });
      }
    }

    /*
     * Generate the final XML.
     */
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',

      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',

      ...urls.map(
        buildUrlEntry,
      ),

      "</urlset>",
      "",
    ].join("\n");

    return new Response(
      xml,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/xml; charset=UTF-8",

          "Cache-Control":
            "public, max-age=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error) {
    console.error(
      "Sitemap generation error:",
      error,
    );

    return new Response(
      "Unable to generate sitemap.",
      {
        status: 500,

        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8",
        },
      },
    );
  }
}
export async function onRequestHead() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type":
        "application/xml; charset=UTF-8",

      "Cache-Control":
        "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
