import SEO from "../components/seo/SEO";
import AboutPreview from "../components/sections/AboutPreview";
import HomeHero from "../components/sections/HomeHero";
import ServicesPreview from "../components/sections/ServicesPreview";
import TrustBar from "../components/sections/TrustBar";
import WorkPreview from "../components/sections/WorkPreview";
import BusinessSchema from "../components/seo/BusinessSchema";

export default function Home() {
  return (
    <>
      <SEO
        title="EcoSurfaceCare | Grout Cleaning, Recolouring & Surface Restoration"
        description="Professional grout cleaning, grout recolouring, BioSteam deep cleaning and hard-surface restoration across Burnley, Blackburn and the wider BB postcode area."
        path="/"
      />
      <BusinessSchema />
      <HomeHero />
      <TrustBar />
      <ServicesPreview />
      <WorkPreview />
      <AboutPreview />
    </>
  );
}
