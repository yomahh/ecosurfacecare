import AboutPreview from "../components/sections/AboutPreview";
import HomeHero from "../components/sections/HomeHero";
import ServicesPreview from "../components/sections/ServicesPreview";
import TrustBar from "../components/sections/TrustBar";
import WorkPreview from "../components/sections/WorkPreview";

export default function Home() {
  return (
    <>
      <HomeHero />
      <TrustBar />
      <ServicesPreview />
      <WorkPreview />
      <AboutPreview />
    </>
  );
}
