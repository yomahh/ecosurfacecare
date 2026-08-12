import { useEffect } from "react";

const SITE_URL =
  "https://ecosurfacecare.co.uk";

const DEFAULT_IMAGE =
  `${SITE_URL}/images/branding/ecosurfacecare-social-share.jpg`;

function upsertMeta(selector, attributes) {
  let element =
    document.head.querySelector(selector);

  if (!element) {
    element =
      document.createElement("meta");

    document.head.appendChild(
      element,
    );
  }

  Object.entries(
    attributes,
  ).forEach(
    ([key, value]) => {
      element.setAttribute(
        key,
        value,
      );
    },
  );
}

function upsertCanonical(url) {
  let canonical =
    document.head.querySelector(
      'link[rel="canonical"]',
    );

  if (!canonical) {
    canonical =
      document.createElement("link");

    canonical.setAttribute(
      "rel",
      "canonical",
    );

    document.head.appendChild(
      canonical,
    );
  }

  canonical.setAttribute(
    "href",
    url,
  );
}

export default function SEO({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
}) {
  useEffect(() => {
    const canonicalUrl =
      path === "/"
        ? `${SITE_URL}/`
        : `${SITE_URL}${path}`;

    document.title =
      title;

    upsertMeta(
      'meta[name="description"]',
      {
        name: "description",
        content: description,
      },
    );

    upsertMeta(
      'meta[name="robots"]',
      {
        name: "robots",
        content: noindex
          ? "noindex, nofollow"
          : "index, follow, max-image-preview:large",
      },
    );

    upsertCanonical(
      canonicalUrl,
    );

    upsertMeta(
      'meta[property="og:type"]',
      {
        property: "og:type",
        content: "website",
      },
    );

    upsertMeta(
      'meta[property="og:site_name"]',
      {
        property:
          "og:site_name",
        content:
          "EcoSurfaceCare",
      },
    );

    upsertMeta(
      'meta[property="og:title"]',
      {
        property: "og:title",
        content: title,
      },
    );

    upsertMeta(
      'meta[property="og:description"]',
      {
        property:
          "og:description",
        content: description,
      },
    );

    upsertMeta(
      'meta[property="og:url"]',
      {
        property: "og:url",
        content:
          canonicalUrl,
      },
    );

    upsertMeta(
      'meta[property="og:image"]',
      {
        property: "og:image",
        content: image,
      },
    );

    upsertMeta(
      'meta[name="twitter:card"]',
      {
        name: "twitter:card",
        content:
          "summary_large_image",
      },
    );

    upsertMeta(
      'meta[name="twitter:title"]',
      {
        name: "twitter:title",
        content: title,
      },
    );

    upsertMeta(
      'meta[name="twitter:description"]',
      {
        name:
          "twitter:description",
        content: description,
      },
    );

    upsertMeta(
      'meta[name="twitter:image"]',
      {
        name: "twitter:image",
        content: image,
      },
    );
  }, [
    title,
    description,
    path,
    image,
    noindex,
  ]);

  return null;
}
