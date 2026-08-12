import {
  Link,
  useParams,
} from "react-router-dom";
import {
  CheckCircle2,
} from "lucide-react";

import SEO from "../components/seo/SEO";
import PageHero from "../components/ui/PageHero";
import { services } from "../data/services";

const serviceSeo = {
  "grout-cleaning": {
    title:
      "Grout Cleaning in Burnley & Blackburn | EcoSurfaceCare",

    description:
      "Professional grout cleaning for bathrooms, kitchens, tiled floors and hard surfaces across Burnley, Blackburn and the wider BB postcode area.",
  },

  "grout-recolouring": {
    title:
      "Grout Recolouring & Sealing | EcoSurfaceCare",

    description:
      "Refresh stained or tired grout with professional grout recolouring and sealing for a cleaner, more consistent and protected finish.",
  },

  "biosteam-cleaning": {
    title:
      "BioSteam Deep Cleaning | EcoSurfaceCare",

    description:
      "Eco-conscious high-temperature BioSteam deep cleaning for grout, tiles and hard surfaces in residential and commercial environments.",
  },

  "surface-restoration": {
    title:
      "Tile & Surface Restoration | EcoSurfaceCare",

    description:
      "Professional tile and hard-surface restoration for floors, splashbacks, shower areas and other tired or heavily used surfaces.",
  },

  "bathroom-restoration": {
    title:
      "Bathroom & Shower Restoration | EcoSurfaceCare",

    description:
      "Restore bathroom and shower surfaces, grout and tiled areas without the disruption and expense of a full renovation.",
  },

  "kitchen-restoration": {
    title:
      "Kitchen Surface Care | EcoSurfaceCare",

    description:
      "Professional care for kitchen tiles, grout lines, splashbacks, floors and other high-use hard surfaces.",
  },

  "floor-maintenance": {
    title:
      "Floor Cleaning & Maintenance | EcoSurfaceCare",

    description:
      "Professional hard-floor cleaning and planned maintenance for domestic and commercial tiled surfaces.",
  },

  "commercial-cleaning": {
    title:
      "Commercial Surface Cleaning | EcoSurfaceCare",

    description:
      "Specialist commercial surface cleaning and maintenance for businesses, landlords and property managers across Lancashire and surrounding areas.",
  },
};

const serviceContent = {
  "grout-cleaning": {
    intro:
      "Grout can gradually darken as dirt, cleaning residue and everyday use build up within the surface. Our grout cleaning service is designed to remove embedded contamination and improve the overall appearance of tiled areas without unnecessary replacement.",

    suitable:
      "This service is suitable for many tiled bathrooms, showers, kitchens, hallways and floors where the grout is structurally sound but has become dull, dirty or uneven in appearance.",

    process:
      [
        "Inspect the tiled area and grout condition",
        "Identify staining, residue and heavily soiled sections",
        "Apply a professional cleaning process suited to the surface",
        "Work carefully along grout lines and detailed areas",
        "Rinse and finish the area before a final inspection",
      ],

    expectations:
      "Results depend on the age, condition and type of grout. Cleaning can significantly improve dirt and discolouration, but permanently stained or badly deteriorated grout may be better suited to recolouring, repair or replacement.",

    aftercare:
      "We will explain suitable day-to-day cleaning methods and products that can help reduce future build-up while avoiding harsh treatments that may damage grout or surrounding surfaces.",
  },

  "grout-recolouring": {
    intro:
      "Grout recolouring is ideal when grout is still serviceable but has become permanently stained, patchy or inconsistent. Instead of removing sound grout, we prepare the existing lines and apply a specialist colour treatment to create a more uniform finish.",

    suitable:
      "It can be used across many bathroom, shower, kitchen and tiled-floor applications where existing grout is stable enough to remain in place.",

    process:
      [
        "Assess the condition of the existing grout",
        "Deep clean and prepare the grout lines",
        "Discuss the preferred grout colour",
        "Apply the specialist colour treatment precisely",
        "Remove excess product from surrounding surfaces",
        "Complete finishing checks and provide care guidance",
      ],

    expectations:
      "Recolouring can dramatically improve the visual consistency of grout lines and is often a practical alternative to full regrouting. Damaged, loose or missing grout may need repair before the recolouring process begins.",

    aftercare:
      "Once the treatment has cured, normal maintenance can resume using suitable non-aggressive cleaning products. We will explain any curing time and specific care requirements for the system used.",
  },

  "biosteam-cleaning": {
    intro:
      "BioSteam deep cleaning uses controlled high-temperature steam to target dirt and contamination across suitable hard surfaces and detailed areas. It can reduce reliance on strong chemical products while still providing a thorough professional clean.",

    suitable:
      "The service can be used on suitable hard surfaces in bathrooms, kitchens, tiled areas and selected commercial environments, subject to an initial assessment of the material and condition.",

    process:
      [
        "Inspect the area and identify suitable surfaces",
        "Prepare surrounding areas before treatment",
        "Apply controlled high-temperature steam",
        "Focus on grout lines, edges and detailed sections",
        "Remove loosened contamination and residue",
        "Complete a final inspection and finishing clean",
      ],

    expectations:
      "Steam cleaning is highly effective for many surface-cleaning applications, but not every material is suitable for high-temperature treatment. We assess the surface first and adjust the method where necessary.",

    aftercare:
      "After treatment, we will provide simple guidance on routine cleaning and how to maintain the refreshed appearance between professional visits.",
  },

  "surface-restoration": {
    intro:
      "Tile and surface restoration is designed for areas that need more than a routine clean. The service focuses on improving the appearance of tired, heavily used or neglected hard surfaces through assessment, specialist cleaning and suitable restoration techniques.",

    suitable:
      "Typical areas include tiled floors, splashbacks, shower surrounds, wall tiles and other suitable hard surfaces in residential or commercial properties.",

    process:
      [
        "Assess the surface material and current condition",
        "Identify staining, residue and worn areas",
        "Select an appropriate restoration method",
        "Deep clean and treat the surface carefully",
        "Address detailed areas and grout where required",
        "Inspect the completed area and discuss maintenance",
      ],

    expectations:
      "The achievable result depends on the type of surface and the extent of wear or damage. Restoration can greatly improve appearance, but permanent physical damage such as chips, cracks or deep wear may remain visible.",

    aftercare:
      "We will recommend suitable maintenance methods based on the restored surface so that the finish can be kept in good condition for as long as possible.",
  },

  "bathroom-restoration": {
    intro:
      "Bathrooms and showers often develop several problems at the same time, including dirty grout, staining, tired silicone and deposits on tiled or glass surfaces. Our restoration approach looks at the complete area rather than treating one issue in isolation.",

    suitable:
      "This service is suitable for many shower enclosures, tiled walls, tiled floors, grout lines and detailed bathroom areas that need refreshing without a full renovation.",

    process:
      [
        "Inspect tiles, grout, silicone and surrounding surfaces",
        "Identify the areas that can be cleaned or restored",
        "Deep clean suitable tiled and grout surfaces",
        "Carry out restoration treatments where appropriate",
        "Address detailed finishing areas",
        "Complete a final inspection with the customer",
      ],

    expectations:
      "A restoration service can make an older bathroom look significantly cleaner and more consistent, but it does not replace structural repair or full renovation where fixtures or surfaces are badly damaged.",

    aftercare:
      "We will provide practical advice on ventilation, routine cleaning and suitable maintenance products to help reduce mould, soap residue and mineral build-up.",
  },

  "kitchen-restoration": {
    intro:
      "Kitchen surfaces are exposed to frequent use, grease, food residue and regular cleaning. Over time, tiled areas and grout lines can become dull or difficult to keep looking clean. Our kitchen surface-care service focuses on restoring a cleaner and more consistent appearance.",

    suitable:
      "Typical areas include tiled floors, splashbacks, grout lines and other suitable hard surfaces around kitchens and utility areas.",

    process:
      [
        "Inspect the kitchen surfaces and grout condition",
        "Identify grease, residue and heavily used areas",
        "Apply appropriate professional cleaning methods",
        "Work carefully around detailed and high-use sections",
        "Rinse and finish treated surfaces",
        "Provide ongoing maintenance guidance",
      ],

    expectations:
      "Professional cleaning can remove substantial build-up, but permanent staining or worn grout may require additional restoration or recolouring for the best visual result.",

    aftercare:
      "Regular cleaning with appropriate products will help prevent grease and residue building up again. We will advise on suitable maintenance for the surfaces treated.",
  },

  "floor-maintenance": {
    intro:
      "Hard floors can lose their appearance gradually as traffic, soil and repeated cleaning leave residue behind. Our floor cleaning and maintenance service is designed to restore cleanliness and support ongoing care for suitable tiled and hard-floor surfaces.",

    suitable:
      "The service can be used for suitable domestic floors as well as selected commercial environments requiring one-off cleaning or a planned maintenance programme.",

    process:
      [
        "Inspect the floor type and level of soiling",
        "Assess grout lines and high-traffic areas",
        "Select a suitable professional cleaning method",
        "Treat the floor systematically and evenly",
        "Remove residue and complete finishing checks",
        "Discuss an appropriate maintenance schedule",
      ],

    expectations:
      "The final appearance depends on the surface material, age and existing wear. Cleaning removes contamination but cannot reverse permanent wear, scratches or physical damage.",

    aftercare:
      "For frequently used floors, routine maintenance can help prevent heavy build-up and make ongoing cleaning easier. We can discuss suitable intervals based on traffic and usage.",
  },

  "commercial-cleaning": {
    intro:
      "Commercial environments need surface-care services that are practical, reliable and suited to the way the site operates. We provide specialist hard-surface cleaning and maintenance for businesses, landlords and property managers.",

    suitable:
      "Suitable projects may include tiled floors, washrooms, communal areas, kitchens and other hard-surface areas in commercial or managed properties.",

    process:
      [
        "Discuss the site, access requirements and priorities",
        "Assess surface types and current condition",
        "Agree the scope of work and suitable timing",
        "Carry out professional cleaning or restoration",
        "Inspect completed areas and identify future needs",
        "Discuss repeat maintenance where appropriate",
      ],

    expectations:
      "Commercial work can be arranged around the needs of the site where practical. The exact process, duration and access requirements depend on the size and condition of the area.",

    aftercare:
      "For sites requiring regular care, we can discuss planned maintenance intervals to help keep surfaces presentable and reduce the need for more intensive restoration later.",
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();

  const service =
    services.find(
      (item) =>
        item.slug === slug,
    );

  if (!service) {
    return (
      <>
        <SEO
          title="Service Not Found | EcoSurfaceCare"
          description="The requested EcoSurfaceCare service page could not be found."
          path={`/services/${slug || ""}`}
          noindex
        />

        <PageHero
          eyebrow="Service not found"
          title="This service page is unavailable"
          text="Please return to the services page."
        />

        <section className="section-space">
          <div className="container-site text-center">
            <Link
              to="/services"
              className="inline-flex rounded-full bg-[#228B22] px-5 py-3 font-bold text-white"
            >
              View our services
            </Link>
          </div>
        </section>
      </>
    );
  }

  const seo =
    serviceSeo[service.slug] || {
      title:
        `${service.title} | EcoSurfaceCare`,

      description:
        service.short,
    };

  const content =
    serviceContent[service.slug];

  return (
    <>
      <SEO
        title={seo.title}
        description={
          seo.description
        }
        path={`/services/${service.slug}`}
      />

      <PageHero
        eyebrow="Specialist service"
        title={service.title}
        text={service.short}
      />

      <section className="section-space">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr]">
            <div>
              <h2 className="text-3xl font-bold text-[#153f36]">
                Professional care
                tailored to the surface
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                {content?.intro ||
                  service.short}
              </p>

              {content?.suitable && (
                <>
                  <h3 className="mt-8 text-2xl font-bold text-[#153f36]">
                    Suitable areas
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {
                      content.suitable
                    }
                  </p>
                </>
              )}

              <h3 className="mt-8 text-2xl font-bold text-[#153f36]">
                What the service
                includes
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {(
                  content?.process ||
                  service.features
                ).map(
                  (feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4"
                    >
                      <CheckCircle2 className="mt-0.5 shrink-0 text-[#176B1C]" />

                      <span className="font-semibold leading-6">
                        {feature}
                      </span>
                    </div>
                  ),
                )}
              </div>

              {content?.expectations && (
                <>
                  <h3 className="mt-10 text-2xl font-bold text-[#153f36]">
                    What to expect
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {
                      content.expectations
                    }
                  </p>
                </>
              )}

              {content?.aftercare && (
                <>
                  <h3 className="mt-10 text-2xl font-bold text-[#153f36]">
                    Aftercare
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {
                      content.aftercare
                    }
                  </p>
                </>
              )}
            </div>

            <aside className="h-fit rounded-3xl bg-[#f5faf7] p-7 lg:sticky lg:top-28">
              <h3 className="text-xl font-bold">
                Discuss your project
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Share the room,
                surface type and current
                condition for an initial
                assessment.
              </p>

              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">
                    Service:
                  </strong>{" "}
                  {service.title}
                </p>

                <p>
                  <strong className="text-slate-900">
                    Coverage:
                  </strong>{" "}
                  Burnley, Blackburn and
                  the wider BB postcode
                  area
                </p>
              </div>

              <Link
                to="/request-a-quote"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#228B22] px-5 py-3 font-bold text-white transition hover:bg-[#176B1C]"
              >
                Request a quote
              </Link>

              <Link
                to="/our-work"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 font-bold text-[#176B1C] transition hover:bg-slate-50"
              >
                View our work
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
