import { useEffect } from "react";

const SITE_URL =
  "https://ecosurfacecare.co.uk";

const BUSINESS_ID =
  `${SITE_URL}/#business`;

function absoluteUrl(url) {
  if (!url) {
    return null;
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${SITE_URL}${url}`;
}

function imageUrl(
  url,
  width = 1600,
) {
  if (!url) {
    return null;
  }

  /*
   * Use Cloudflare's image
   * transformation for images
   * exposed in structured data.
   */
  return absoluteUrl(
    `/cdn-cgi/image/width=${width},quality=85,format=auto${url}`,
  );
}

export default function ProjectSchema({
  project,
}) {
  useEffect(() => {
    if (
      !project ||
      !project.slug
    ) {
      return undefined;
    }

    const id =
      "ecosurfacecare-project-schema";

    const existing =
      document.getElementById(id);

    if (existing) {
      existing.remove();
    }

    const projectUrl =
      `${SITE_URL}/our-work/${project.slug}`;

    const imageMedia =
      (project.media || [])
        .filter(
          (item) =>
            item.media_type ===
            "image",
        )
        .map((item) =>
          imageUrl(
            item.url,
            1600,
          ),
        )
        .filter(Boolean);

    const category =
      String(
        project.category || "",
      )
        .replaceAll("-", " ")
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase(),
        );

    const mainEntity = {
      "@type":
        "CreativeWork",

      "@id":
        `${projectUrl}#project`,

      name:
        project.title,

      url:
        projectUrl,

      description:
        project.description ||
        `Completed EcoSurfaceCare ${category.toLowerCase()} project.`,

      creator: {
        "@id":
          BUSINESS_ID,
      },

      provider: {
        "@id":
          BUSINESS_ID,
      },

      about:
        category ||
        "Surface restoration",

      mainEntityOfPage: {
        "@id":
          projectUrl,
      },
    };

    if (imageMedia.length > 0) {
      mainEntity.image =
        imageMedia;
    }

    if (project.location) {
      mainEntity.contentLocation =
        {
          "@type":
            "Place",

          name:
            project.location,
        };
    }

    if (project.published_at) {
      mainEntity.datePublished =
        project.published_at;
    }

    if (project.updated_at) {
      mainEntity.dateModified =
        project.updated_at;
    }

    const schema = {
      "@context":
        "https://schema.org",

      "@graph": [
        {
          "@type":
            "WebPage",

          "@id":
            projectUrl,

          url:
            projectUrl,

          name:
            project.title,

          description:
            project.description ||
            `Completed EcoSurfaceCare ${category.toLowerCase()} project.`,

          isPartOf: {
            "@id":
              `${SITE_URL}/#website`,
          },

          about: {
            "@id":
              BUSINESS_ID,
          },

          mainEntity: {
            "@id":
              `${projectUrl}#project`,
          },
        },

        mainEntity,
      ],
    };

    const script =
      document.createElement(
        "script",
      );

    script.id = id;

    script.type =
      "application/ld+json";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(
      script,
    );

    return () => {
      const current =
        document.getElementById(
          id,
        );

      if (current) {
        current.remove();
      }
    };
  }, [project]);

  return null;
}
