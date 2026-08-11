import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import PageHero from "../components/ui/PageHero";
import { services } from "../data/services";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find(item => item.slug === slug);
  if (!service) return <PageHero eyebrow="Service not found" title="This service page is unavailable" text="Please return to the services page." />;

  return (
    <>
      <PageHero eyebrow="Specialist service" title={service.title} text={service.short} />
      <section className="section-space">
        <div className="container-site grid gap-12 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <h2 className="text-3xl font-bold text-[#153f36]">What the service includes</h2>
            <p className="mt-5 leading-8 text-slate-600">This page is ready for the final service process, suitable surfaces, expected timescales, aftercare information and real project photography.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.features.map(feature => <div key={feature} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4"><CheckCircle2 className="text-[#176B1C]" /> <span className="font-semibold">{feature}</span></div>)}
            </div>
          </div>
          <aside className="rounded-3xl bg-[#f5faf7] p-7">
            <h3 className="text-xl font-bold">Discuss your project</h3>
            <p className="mt-3 leading-7 text-slate-600">Share the room, surface type and current condition for an initial assessment.</p>
            <Link to="/request-a-quote" className="mt-6 inline-block rounded-full bg-[#228B22] px-5 py-3 font-bold text-white">Request a quote</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
