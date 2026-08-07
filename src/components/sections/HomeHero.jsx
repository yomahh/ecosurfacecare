import { ArrowRight, BadgeCheck } from "lucide-react";
import Button from "../ui/Button";

export default function HomeHero() {
  return (
    <section className="hero-surface relative overflow-hidden">
      <div className="container-site relative grid min-h-0 items-center gap-14 py-12 sm:py-16 lg:min-h-[680px] lg:grid-cols-[1.02fr_.98fr] lg:py-20">
        {/* LEFT COLUMN */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand shadow-sm backdrop-blur">
            <BadgeCheck size={16} />
            Professional surface care
          </div>

          <h1 className="mt-7 text-[2.6rem] font-bold leading-[1.06] tracking-[-0.04em] text-heading sm:text-5xl lg:text-6xl xl:text-7xl">
            Bring tired
            <br />
            hard surfaces
            <br />
            <span className="text-brand">back to life.</span>
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

          {/* AUTHORISED PARTNERS */}
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
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rotate-2 rounded-[2.5rem] bg-gradient-to-br from-[#228B22]/15 to-cyan-400/10"
          />

          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#102F14] p-2 shadow-[0_28px_80px_rgba(16,47,20,0.28)]">
            <div className="overflow-hidden rounded-[1.7rem]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-[4/3] w-full object-cover"
                aria-label="Animated EcoSurfaceCare logo"
              >
                <source src="/videos/animated-logo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
