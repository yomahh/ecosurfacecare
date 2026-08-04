import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/our-work", label: "Our Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const legal = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/cookies", label: "Cookie Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/accessibility", label: "Accessibility" },
];

export default function Footer() {
  return (
    <footer className="bg-[#102f2a] text-white">
      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1.4fr_.7fr_.7fr_1fr] lg:py-18">
        <div>
          <Link
            to="/"
            className="inline-flex rounded-2xl bg-white p-3"
            aria-label="EcoSurfaceCare homepage"
          >
            <img
              src="/images/branding/ecosurfacecare-logo.png"
              alt="EcoSurfaceCare"
              className="h-16 w-auto max-w-[250px] object-contain"
            />
          </Link>

          <p className="mt-6 max-w-md leading-7 text-slate-300">
            Professional cleaning, grout recolouring, restoration and
            maintenance for hard surfaces in homes and commercial spaces.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="EcoSurfaceCare on Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <Facebook size={18} />
            </a>

            <a
              href="#"
              aria-label="EcoSurfaceCare on Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-white">Explore</h2>

          <nav className="mt-5 flex flex-col gap-3">
            {navigation.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="font-bold text-white">Information</h2>

          <nav className="mt-5 flex flex-col gap-3">
            {legal.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="font-bold text-white">Contact</h2>

          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <a
              href="tel:"
              className="flex items-start gap-3 transition hover:text-white"
            >
              <Phone size={18} className="mt-0.5 shrink-0 text-emerald-300" />

              <span>Add final phone number</span>
            </a>

            <a
              href="mailto:"
              className="flex items-start gap-3 transition hover:text-white"
            >
              <Mail size={18} className="mt-0.5 shrink-0 text-emerald-300" />

              <span>Add final business email</span>
            </a>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-emerald-300" />

              <span>Add confirmed service area</span>
            </div>
          </div>

          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-200 transition hover:text-white"
          >
            Contact EcoSurfaceCare
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} EcoSurfaceCare. All rights reserved.
          </p>

          <p>Professional Cleaning, Restoration & Maintenance</p>
        </div>
      </div>
    </footer>
  );
}
