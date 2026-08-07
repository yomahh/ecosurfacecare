import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { services } from "../../data/services";

export default function ServicesGrid({ limit }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {list.map(({ slug, title, short, icon: Icon }) => (
        <article key={slug} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-[#228B22]"><Icon /></div>
          <h3 className="mt-5 text-xl font-bold text-[#153f36]">{title}</h3>
          <p className="mt-3 leading-7 text-slate-600">{short}</p>
          <Link to={`/services/${slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-[#228B22]">Learn more <ArrowRight size={17} /></Link>
        </article>
      ))}
    </div>
  );
}
