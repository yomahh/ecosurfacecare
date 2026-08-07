import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";

const navigation = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/our-work", label: "Our Work" },
  //{ to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinkClass = ({ isActive }) =>
    [
      "relative py-2 text-sm font-semibold transition-colors duration-200",
      "after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5",
      "after:origin-left after:rounded-full after:bg-[#228B22]",
      "after:transition-transform after:duration-200",
      isActive
        ? "text-[#228B22] after:scale-x-100"
        : "text-slate-700 after:scale-x-0 hover:text-[#228B22] hover:after:scale-x-100",
    ].join(" ");

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-white/90 backdrop-blur-lg",
        ].join(" ")}
      >
        <div
          className={[
            "container-site flex items-center justify-between transition-all duration-300",
            scrolled ? "h-[72px]" : "h-[88px]",
          ].join(" ")}
        >
          <Link
            to="/"
            className="relative z-50 flex shrink-0 items-center"
            aria-label="EcoSurfaceCare homepage"
          >
            <img
              src="/images/branding/ecosurfacecare-logo.png"
              alt="EcoSurfaceCare"
              className={[
                "w-auto object-contain transition-all duration-300",
                scrolled ? "h-16 max-w-[260px]" : "h-20 max-w-[300px]",
              ].join(" ")}
            />
          </Link>

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={navLinkClass}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button to="/request-a-quote" size="small">
              Request a Free Quote
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="relative z-50 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-[#17352f] shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-40 bg-[#102f2a]/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-navigation"
        className={[
          "fixed right-0 top-0 z-40 flex h-dvh w-full max-w-sm flex-col bg-white px-6 pb-8 pt-28 shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col" aria-label="Mobile navigation">
          {navigation.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "border-b border-slate-100 py-5 text-xl font-bold transition-colors",
                  isActive
                    ? "text-[#228B22]"
                    : "text-[#17352f] hover:text-[#228B22]",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <Button
            to="/request-a-quote"
            size="large"
            className="w-full"
          >
            Request a Free Quote
          </Button>

          <p className="mt-5 text-center text-sm leading-6 text-slate-500">
            Professional cleaning, restoration and maintenance for hard
            surfaces.
          </p>
        </div>
      </aside>
    </>
  );
}
