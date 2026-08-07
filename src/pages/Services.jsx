import PageHero from "../components/ui/PageHero";
import ServicesGrid from "../components/sections/ServicesGrid";

export default function Services() {
  return (
    <>
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
