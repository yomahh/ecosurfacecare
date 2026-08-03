import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-[#0b6f63] text-white">
      <div className="container-site flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">Planning a clean or restoration?</p>
          <h2 className="mt-3 text-3xl font-bold">Tell us about the surfaces you would like restored.</h2>
          <p className="mt-3 max-w-2xl text-emerald-50">Share the room, surface type and current condition. We will use the details to prepare the next step.</p>
        </div>
        <Link to="/request-a-quote" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#0b6f63] transition hover:bg-emerald-50">
          Request a quote <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
