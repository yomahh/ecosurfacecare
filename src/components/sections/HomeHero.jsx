import { ArrowRight, BadgeCheck } from "lucide-react";
import Button from "../ui/Button";

export default function HomeHero() {
  return (
    <section className="surface-grid relative overflow-hidden bg-[#f5faf7]">
      <div
        aria-hidden="true"
        className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="container-site relative grid min-h-[calc(100vh-88px)] items-center gap-14 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0b6f63] shadow-sm backdrop-blur">
            <BadgeCheck size={16} />
            Professional surface care
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[#17352f] sm:text-5xl lg:text-6xl xl:text-7xl">
            Bring tired
            <br />
            hard surfaces
            <br />
            <span className="text-[#0b6f63]">back to life.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Specialist grout recolouring, deep surface cleaning and
            eco-conscious steam care for homes and commercial spaces.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button
              to="/request-a-quote"
              size="large"
              icon={<ArrowRight size={19} />}
            >
              Request a Free Quote
            </Button>

            <Button to="/our-work" size="large" variant="secondary">
              View Our Work
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rotate-2 rounded-[2.5rem] bg-[#0b6f63]/10"
          />

          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white p-4 shadow-[0_28px_80px_rgba(23,53,47,0.18)]">
            <div className="overflow-hidden rounded-[1.7rem]">
              <img
                src="/images/branding/ecosurfacecare-business-card.jpeg"
                alt="EcoSurfaceCare professional cleaning and restoration"
                className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
