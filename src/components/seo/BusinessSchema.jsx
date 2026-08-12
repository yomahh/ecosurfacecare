import { useEffect } from "react";

export default function BusinessSchema() {
  useEffect(() => {
    const id =
      "ecosurfacecare-business-schema";

    const existing =
      document.getElementById(id);

    if (existing) {
      existing.remove();
    }

    const schema = {
      "@context":
        "https://schema.org",

      "@type":
        "ProfessionalService",

      "@id":
        "https://ecosurfacecare.co.uk/#business",

      name:
        "EcoSurfaceCare",

      url:
        "https://ecosurfacecare.co.uk/",

      telephone:
        "+44 7873 945808",

      email:
        "contact@ecosurfacecare.co.uk",

      description:
        "Professional grout cleaning, grout recolouring, silicone replacement, BioSteam deep cleaning and hard-surface restoration services.",

      logo:
        "https://ecosurfacecare.co.uk/images/branding/ecosurfacecare-logo-header.webp",

      image:
        "https://ecosurfacecare.co.uk/images/branding/ecosurfacecare-social-share.jpg",

      areaServed: [
        {
          "@type": "City",
          name: "Burnley",
        },
        {
          "@type": "City",
          name: "Blackburn",
        },
        {
          "@type": "City",
          name: "Darwen",
        },
        {
          "@type": "City",
          name: "Accrington",
        },
        {
          "@type": "City",
          name: "Clitheroe",
        },
        {
          "@type": "City",
          name: "Nelson",
        },
        {
          "@type": "City",
          name: "Colne",
        },
        {
          "@type": "AdministrativeArea",
          name: "Ribble Valley",
        },
      ],

      contactPoint: {
        "@type":
          "ContactPoint",

        telephone:
          "+44 7873 945808",

        contactType:
          "customer service",

        areaServed:
          "GB",

        availableLanguage: [
          "English",
        ],
      },

      knowsAbout: [
        "Grout cleaning",
        "Grout recolouring",
        "Silicone replacement",
        "BioSteam deep cleaning",
        "Tile restoration",
        "Bathroom restoration",
        "Hard surface cleaning",
        "Commercial surface cleaning",
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
  }, []);

  return null;
}
