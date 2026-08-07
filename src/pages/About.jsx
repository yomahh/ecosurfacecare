import PageHero from "../components/ui/PageHero";
import { BadgeCheck, Eye, HeartHandshake } from "lucide-react";

export default function About() {
  return (
    <>
      <PageHero eyebrow="About EcoSurfaceCare" title="A specialist surface-care company built around quality and responsibility" text="EcoSurfaceCare provides professional cleaning, restoration and maintenance for hard surfaces in homes and commercial spaces." />
      <section className="section-space">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#153f36]">Our approach</h2>
            <p className="mt-5 leading-8 text-slate-600">We focus on visible improvement, detailed workmanship and straightforward communication. Every project begins with understanding the surface, its condition and the customer’s desired result.</p>
            <p className="mt-5 leading-8 text-slate-600">The final launch version can include the owner’s story, professional experience, coverage area, insurance details and verified authorisation information.</p>
          </div>
          <div className="grid gap-5">
            {[[BadgeCheck,"Trusted methods","Authorised partner positioning for GroutGleam and BioSteam."],[Eye,"Attention to detail","Careful preparation, neat application and clear finishing checks."],[HeartHandshake,"Customer-first service","Professional communication from first enquiry through completion."]].map(([Icon,title,text]) => <div key={title} className="rounded-3xl border border-slate-200 p-6"><Icon className="text-[#228B22]"/><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></div>)}
          </div>
        </div>
      </section>
    </>
  );
}
