import SEO from "../components/seo/SEO";
import PageHero from "../components/ui/PageHero";
import ServicesGrid from "../components/sections/ServicesGrid";

export default function Services() {
  return (
    <>
      <SEO
        title="Surface Cleaning & Restoration Services | EcoSurfaceCare"
        description="Explore professional grout cleaning, grout recolouring, BioSteam cleaning, tile restoration, bathroom restoration and specialist surface care across Burnley, Blackburn and surrounding areas."
        path="/services"
      />

      <PageHero
        eyebrow="Services"
        title="Professional care for grout, tiles and hard surfaces"
        text="Explore cleaning, recolouring, restoration and planned maintenance services for residential and commercial environments."
      />

      <section className="pt-10 pb-6 lg:pt-12 lg:pb-10">
        <div className="container-site">
          <ServicesGrid />
        </div>
      </section>
    </>
  );
}
