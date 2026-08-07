import PageHero from "../components/ui/PageHero";
import { Leaf, Recycle, Trees } from "lucide-react";

export default function Sustainability() {
  return (
    <>
      <PageHero eyebrow="Sustainability" title="Cleaning with a greater purpose" text="EcoSurfaceCare is being developed as a responsible business that considers product use, surface lifespan and future environmental contributions." />
      <section className="section-space">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {[[Leaf,"Lower-impact thinking","Choose suitable methods that reduce unnecessary reliance on harsh products."],[Recycle,"Restore before replacing","Help extend the useful life of grout, tiles and existing hard surfaces."],[Trees,"Future tree contribution","A portion of earnings is planned to support tree planting through Tree-Nation once the programme is formally active."]].map(([Icon,title,text]) => <article key={title} className="rounded-3xl border border-slate-200 p-7"><Icon className="text-[#228B22]"/><h2 className="mt-5 text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}
        </div>
        <div className="container-site mt-12 rounded-3xl bg-[#f5faf7] p-8">
          <h2 className="text-2xl font-bold">Tree-Nation statement</h2>
          <p className="mt-4 leading-8 text-slate-600">The website intentionally describes this as a future commitment. Exact contribution levels, project links and impact figures should only be published once the arrangement is officially active.</p>
        </div>
      </section>
    </>
  );
}
