import {
  BadgeCheck,
  Building2,
  Home,
  Leaf,
} from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Authorised Partner",
    text: "GroutGleam and BioSteam",
  },
  {
    icon: Home,
    title: "Residential",
    text: "Professional care for homes",
  },
  {
    icon: Building2,
    title: "Commercial",
    text: "Reliable business services",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious",
    text: "Responsible cleaning methods",
  },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Why customers trust EcoSurfaceCare"
      className="border-y border-slate-200 bg-white"
    >
      <div className="container-site grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        {trustItems.map(({ icon: Icon, title, text }, index) => (
          <div
            key={title}
            className={[
              "flex items-center gap-4 px-2 py-7 sm:px-6",
              index > 0 ? "lg:border-l lg:border-slate-200" : "",
              index % 2 === 1 ? "sm:border-l sm:border-slate-200" : "",
              index >= 2 ? "sm:border-t sm:border-slate-200 lg:border-t-0" : "",
            ].join(" ")}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-[#176B1C]">
              <Icon size={22} />
            </span>

            <div>
              <h2 className="font-bold text-[#17352f]">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
