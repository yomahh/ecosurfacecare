import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  Recycle,
  ShieldCheck,
} from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const values = [
  {
    icon: ShieldCheck,
    title: "Detailed workmanship",
    text: "Careful preparation, precise application and attention to every visible finishing detail.",
  },
  {
    icon: BadgeCheck,
    title: "Specialist partnerships",
    text: "Authorised GroutGleam and BioSteam expertise for professional cleaning and restoration.",
  },
  {
    icon: Recycle,
    title: "Restore before replacing",
    text: "Helping extend the useful life of existing grout, tiles and hard surfaces.",
  },
];

export default function AboutPreview() {
  return (
    <section className="section-space overflow-hidden bg-[#102f2a] text-white">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
          />

          <Badge
            variant="success"
            icon={<Leaf size={14} />}
            className="relative"
          >
            About EcoSurfaceCare
          </Badge>

          <h2 className="relative mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Professional surface care with a responsible direction.
          </h2>

          <p className="relative mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            EcoSurfaceCare specialises in cleaning, restoring and maintaining
            hard surfaces in homes and commercial spaces. Our goal is to
            deliver visible results while helping customers preserve existing
            materials wherever practical.
          </p>

          <p className="relative mt-5 max-w-2xl leading-8 text-emerald-50">
            As the business grows, part of our earnings is planned to support
            tree planting through Tree-Nation, creating a wider environmental
            benefit from every completed project.
          </p>

          <Button
            to="/about"
            variant="secondary"
            icon={<ArrowRight size={18} />}
            className="relative mt-8 border-white bg-white text-[#176B1C] hover:bg-emerald-50"
          >
            Discover our story
          </Button>
        </div>

        <div className="grid gap-5">
          {values.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group flex gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-emerald-50 transition group-hover:bg-white group-hover:text-[#176B1C]">
                <Icon size={23} />
              </span>

              <div>
                <h3 className="text-xl font-bold">{title}</h3>

                <p className="mt-2 leading-7 text-emerald-50">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
