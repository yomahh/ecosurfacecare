import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#102f2a] text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src="/images/branding/ecosurfacecare-logo.png" alt="EcoSurfaceCare" className="h-20 w-auto rounded bg-white p-2" />
          <p className="mt-5 max-w-xl leading-7 text-slate-300">
            Professional cleaning, restoration and maintenance for hard surfaces in homes and commercial spaces.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Explore</h3>
          <div className="mt-4 flex flex-col gap-3 text-slate-300">
            <Link to="/services">Services</Link><Link to="/gallery">Gallery</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Information</h3>
          <div className="mt-4 flex flex-col gap-3 text-slate-300">
            <Link to="/privacy">Privacy</Link><Link to="/cookies">Cookies</Link><Link to="/terms">Terms</Link><Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-sm text-slate-400 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} EcoSurfaceCare. All rights reserved.</span>
          <Link to="/admin" className="hover:text-white">Owner login</Link>
        </div>
      </div>
    </footer>
  );
}
