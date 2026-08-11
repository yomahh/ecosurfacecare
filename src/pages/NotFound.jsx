import { Link } from "react-router-dom";
export default function NotFound() {
  return <section className="grid min-h-[65vh] place-items-center px-6 text-center"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#176B1C]">404</p><h1 className="mt-4 text-4xl font-bold">Page not found</h1><p className="mt-4 text-slate-600">The page may have moved or the address may be incorrect.</p><Link to="/" className="mt-7 inline-block rounded-full bg-[#228B22] px-6 py-3 font-bold text-white">Return home</Link></div></section>
}
