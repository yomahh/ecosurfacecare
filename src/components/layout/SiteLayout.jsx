import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CTA from "../ui/CTA";
import FloatingContactButtons from "../ui/FloatingContactButtons";

export default function SiteLayout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <CTA />
      <Footer />
      <FloatingContactButtons />
    </>
  );
}
