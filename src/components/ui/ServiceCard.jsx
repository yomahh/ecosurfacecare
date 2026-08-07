import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServiceCard({
  slug,
  title,
  description,
  features = [],
  icon: Icon,
  featured = false,
}) {
  return (
    <article
      className={[
        "group flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white",
        "transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        featured
          ? "border-emerald-300 shadow-lg"
          : "border-slate-200 shadow-sm",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex min-h-52 items-end overflow-hidden p-7",
          featured
            ? "bg-[#228B22]"
            : "bg-gradient-to-br from-[#eefaf7] via-white to-[#dff4ee]",
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className={[
            "absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl",
            featured ? "bg-emerald-300/30" : "bg-emerald-300/35",
          ].join(" ")}
        />

        <div
          aria-hidden="true"
          className={[
            "absolute -bottom-16 -left-10 h-40 w-40 rounded-full blur-3xl",
            featured ? "bg-cyan-200/20" : "bg-cyan-100/70",
          ].join(" ")}
        />

        <div
          className={[
            "relative grid h-20 w-20 place-items-center rounded-[1.5rem] border",
            "transition duration-300 group-hover:scale-105 group-hover:-rotate-2",
            featured
              ? "border-white/20 bg-white/15 text-white backdrop-blur"
              : "border-emerald-200 bg-white text-[#228B22] shadow-md",
          ].join(" ")}
        >
          {Icon && <Icon size={36} strokeWidth={1.7} />}
        </div>

        {featured && (
          <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
            Popular service
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-2xl font-bold tracking-tight text-[#17352f]">
          {title}
        </h3>

        <p className="mt-4 leading-7 text-slate-600">{description}</p>

        {features.length > 0 && (
          <ul className="mt-6 space-y-3">
            {features.slice(0, 3).map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm font-medium text-slate-600"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-[#228B22]">
                  <Check size={13} strokeWidth={3} />
                </span>

                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <Link
          to={`/services/${slug}`}
          className={[
            "mt-7 inline-flex items-center gap-2 border-t border-slate-100 pt-5",
            "font-bold text-[#228B22] transition-colors hover:text-[#08584e]",
          ].join(" ")}
        >
          Explore this service

          <ArrowUpRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </div>
    </article>
  );
}
