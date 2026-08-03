import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  ["/", "Home"], ["/services", "Services"], ["/gallery", "Gallery"],
  ["/about", "About"], ["/sustainability", "Sustainability"],
  ["/reviews", "Reviews"], ["/contact", "Contact"]
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const navClass = ({ isActive }) =>
    `text-sm font-semibold transition ${isActive ? "text-[#0b6f63]" : "text-slate-700 hover:text-[#0b6f63]"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-site flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src="/images/branding/ecosurfacecare-logo.png" alt="EcoSurfaceCare" className="h-14 w-auto max-w-[210px] object-contain" />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} className={navClass}>{label}</NavLink>)}
          <Link to="/request-a-quote" className="rounded-full bg-[#0b6f63] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#085c52]">Request a quote</Link>
        </nav>
        <button className="rounded-lg p-2 text-slate-700 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-5 lg:hidden">
          <div className="container-site flex flex-col gap-4">
            {links.map(([to, label]) => <NavLink key={to} to={to} className={navClass} onClick={() => setOpen(false)}>{label}</NavLink>)}
            <Link to="/request-a-quote" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-[#0b6f63] px-5 py-3 text-center font-bold text-white">Request a quote</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
