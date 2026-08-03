import { useState } from "react";
import { ChevronDown } from "lucide-react";
import PageHero from "../components/ui/PageHero";
import { faqs } from "../data/faqs";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHero eyebrow="Frequently asked questions" title="Helpful answers before you request a quote" text="These starter questions can be expanded once the exact service process, coverage and policies are confirmed." />
      <section className="section-space"><div className="container-site max-w-4xl">{faqs.map(([q,a],i)=><div key={q} className="border-b border-slate-200"><button onClick={()=>setOpen(open===i?-1:i)} className="flex w-full items-center justify-between gap-4 py-6 text-left text-lg font-bold"><span>{q}</span><ChevronDown className={`shrink-0 transition ${open===i?"rotate-180":""}`}/></button>{open===i&&<p className="pb-6 leading-8 text-slate-600">{a}</p>}</div>)}</div></section>
    </>
  );
}
