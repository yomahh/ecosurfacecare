import PageHero from "../components/ui/PageHero";
import { reviews } from "../data/reviews";

export default function Reviews() {
  return (
    <>
      <PageHero eyebrow="Reviews" title="Customer experiences and project feedback" text="Replace these demonstration entries with genuine Google, Facebook or direct customer reviews before launch." />
      <section className="section-space"><div className="container-site grid gap-6 md:grid-cols-3">{reviews.map((r,i)=><blockquote key={i} className="rounded-3xl border border-slate-200 p-7"><div className="text-amber-500">★★★★★</div><p className="mt-4 leading-7 text-slate-600">“{r.text}”</p><footer className="mt-5 font-bold">{r.name}<span className="block text-sm font-normal text-slate-500">{r.source}</span></footer></blockquote>)}</div></section>
    </>
  );
}
