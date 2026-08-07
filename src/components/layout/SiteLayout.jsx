import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CTA from "../ui/CTA";
import FloatingContactButtons from "../ui/FloatingContactButtons";

export default function SiteLayout() {
  const location = useLocation();

  const hideCTA = location.pathname === "/request-a-quote";

  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      {!hideCTA && <CTA />}

      <Footer />
      <FloatingContactButtons />
    </>
  );
}
