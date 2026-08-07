import { useState } from "react";
import PageHero from "../components/ui/PageHero";
import { galleryItems } from "../data/gallery";

export default function OurWork() {
  const categories = ["All", ...new Set(galleryItems.map(x => x.category))];
  const [active, setActive] = useState("All");
  const items = active === "All" ? galleryItems : galleryItems.filter(x => x.category === active);

  return (
    <>
      <PageHero
  eyebrow="Our Work"
  title="Real surface transformations and completed projects"
  text="Explore cleaning, grout recolouring and restoration work completed for residential and commercial spaces."
/>
      <section className="section-space">
        <div className="container-site">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => <button key={category} onClick={() => setActive(category)} className={`rounded-full px-5 py-2.5 font-semibold ${active === category ? "bg-[#228B22] text-white" : "bg-slate-100 text-slate-700"}`}>{category}</button>)}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200"><img src={item.image} alt={item.title} className="aspect-square w-full object-cover" /><div className="p-6"><p className="text-sm font-bold text-[#228B22]">{item.category}</p><h2 className="mt-2 text-xl font-bold">{item.title}</h2><p className="mt-2 text-slate-500">{item.location}</p></div></article>)}
          </div>
        </div>
      </section>
    </>
  );
}
