import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CTA from "../ui/CTA";

export default function SiteLayout() {
  return (
    <>
      <Header />
      <main><Outlet /></main>
      <CTA />
      <Footer />
    </>
  );
}
