import PageHero from "../components/ui/PageHero";
import { BadgeCheck, Eye, HeartHandshake } from "lucide-react";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About EcoSurfaceCare"
        title="A specialist surface-care company built around quality and responsibility"
        text="EcoSurfaceCare provides professional cleaning, restoration and maintenance for hard surfaces in homes and commercial spaces."
      />

      <section className="pt-10 pb-6 lg:pt-12 lg:pb-10">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-heading">
              Our approach
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              EcoSurfaceCare specialises in professional cleaning, grout
              recolouring, restoration and ongoing care for hard surfaces in
              residential and commercial environments.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Our approach is simple: understand the condition of the surface
              first, choose the right method for the job, and focus on
              achieving a clean, consistent and long-lasting finish.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              As an authorised partner of GroutGleam and BioSteam, we work
              with specialist systems designed to restore and maintain
              surfaces rather than simply covering up the problem.
            </p>

            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-body">
                Authorised partners
              </p>

              <div className="mt-4 flex items-center gap-8 sm:gap-10">
                <img
                  src="/images/partners/groutgleam-logo.png"
                  alt="GroutGleam authorised partner"
                  className="h-20 w-auto object-contain sm:h-24"
                />

                <div
                  className="h-10 w-px bg-[var(--color-border)]"
                  aria-hidden="true"
                />

                <img
                  src="/images/partners/biosteam-logo.png"
                  alt="BioSteam authorised partner"
                  className="h-14 w-auto object-contain sm:h-16"
                />
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Specialist systems for professional grout restoration and
                eco-conscious steam cleaning.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {[
              [
                BadgeCheck,
                "Trusted specialist methods",
                "Authorised GroutGleam and BioSteam partner using specialist cleaning and restoration systems.",
              ],
              [
                Eye,
                "Attention to detail",
                "Careful preparation, precise application and thorough finishing checks on every project.",
              ],
              [
                HeartHandshake,
                "Customer-first service",
                "Clear communication from the first enquiry through to completion, with straightforward advice about the work required.",
              ],
            ].map(([Icon, title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200 p-6"
              >
                <Icon className="text-brand" />

                <h3 className="mt-4 text-xl font-bold text-heading">
                  {title}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
