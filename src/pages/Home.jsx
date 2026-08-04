import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import ServicesGrid from "../components/sections/ServicesGrid";
import { galleryItems } from "../data/gallery";
import { reviews } from "../data/reviews";

export default function Home() {
  return (
    <>
      <section className="surface-grid overflow-hidden bg-[#f5faf7]">
        <div className="container-site grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0b6f63]">Cleaning, restoration & maintenance</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#153f36] sm:text-5xl lg:text-6xl">
              Bring tired hard surfaces back to life.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Specialist grout recolouring, deep surface cleaning and eco-conscious steam care for homes and commercial spaces.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/request-a-quote" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b6f63] px-6 py-3.5 font-bold text-white hover:bg-[#085c52]">Request a free quote <ArrowRight size={18} /></Link>
              <Link to="/our-work" className="inline-flex items-center justify-center rounded-full border border-[#0b6f63] px-6 py-3.5 font-bold text-[#0b6f63] hover:bg-emerald-50">View our results</Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Authorised brand partner", "Residential & commercial", "Eco-conscious approach"].map(x => <div key={x} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><BadgeCheck size={18} className="text-[#0b6f63]" />{x}</div>)}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[2rem] bg-white p-5 shadow-xl">
              <img src="/images/branding/ecosurfacecare-business-card.jpeg" alt="EcoSurfaceCare brand presentation" className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-site">
          <SectionHeading eyebrow="Our services" title="Specialist care for grout, tiles and hard surfaces" text="A focused range of services designed to clean, restore and help maintain the surfaces people notice every day." />
          <div className="mt-12"><ServicesGrid limit={6} /></div>
          <div className="mt-10 text-center"><Link to="/services" className="font-bold text-[#0b6f63]">View all services →</Link></div>
        </div>
      </section>

      <section className="section-space bg-[#f5faf7]">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Why EcoSurfaceCare" title="Careful work. Clear communication. Visible improvement." />
            <div className="mt-8 grid gap-5">
              {[
                [Sparkles, "Detail-focused finish", "Every project is approached carefully, with attention given to edges, lines and high-use areas."],
                [ShieldCheck, "Professional process", "The surface condition is assessed before the most suitable cleaning or restoration method is selected."],
                [Leaf, "Responsible direction", "The business is being built around lower-impact methods and a future tree-planting contribution."]
              ].map(([Icon, title, text]) => <div key={title} className="flex gap-4"><div className="mt-1 text-[#0b6f63]"><Icon /></div><div><h3 className="font-bold text-[#153f36]">{title}</h3><p className="mt-1 leading-7 text-slate-600">{text}</p></div></div>)}
            </div>
          </div>
          <div className="rounded-3xl bg-[#0b6f63] p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">Authorised partnerships</p>
            <h2 className="mt-4 text-3xl font-bold">GroutGleam and BioSteam expertise</h2>
            <p className="mt-5 leading-8 text-emerald-50">EcoSurfaceCare is proud to represent specialist cleaning and restoration methods from trusted partner brands across the UK.</p>
            <Link to="/about" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-[#0b6f63]">About the company <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-site">
          <SectionHeading eyebrow="Recent work" title="A gallery built around real results" text="The live website will allow the owner to upload, edit, organise and remove project photos and videos from a private admin area." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {galleryItems.map(item => <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><img src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover"/><div className="p-6"><p className="text-sm font-bold text-[#0b6f63]">{item.category}</p><h3 className="mt-2 text-xl font-bold">{item.title}</h3><p className="mt-2 text-slate-500">{item.location}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="section-space bg-[#f5faf7]">
        <div className="container-site">
          <SectionHeading eyebrow="Customer confidence" title="Built to showcase genuine feedback" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((review, i) => <blockquote key={i} className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-amber-500">★★★★★</div><p className="mt-4 leading-7 text-slate-600">“{review.text}”</p><footer className="mt-5 font-bold text-[#153f36]">{review.name}<span className="block text-sm font-normal text-slate-500">{review.source}</span></footer></blockquote>)}
          </div>
        </div>
      </section>
    </>
  );
}
