import {
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({
  title,
  category,
  location,
  image,
  to = "/our-work",
  featured = false,
}) {
  return (
    <article
      className={[
        "group overflow-hidden rounded-[2rem] border bg-white",
        "transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        featured
          ? "border-emerald-300 shadow-lg"
          : "border-slate-200 shadow-sm",
      ].join(" ")}
    >
      <Link
        to={to}
        className="block"
      >
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className={[
              "w-full object-cover transition duration-700 group-hover:scale-105",
              featured
                ? "aspect-[16/10]"
                : "aspect-[4/3]",
            ].join(" ")}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#102f2a]/70 via-transparent to-transparent" />

          <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#176B1C] backdrop-blur">
            {category}
          </span>

          {featured && (
            <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-[#228B22]/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
              Featured project
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <h3 className="text-2xl font-bold tracking-tight">
              {title}
            </h3>

            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-50">
              <MapPin size={16} />

              <span>
                {location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-6">
          <p className="text-sm font-semibold text-slate-500">
            View the completed transformation
          </p>

          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-[#176B1C] transition group-hover:bg-[#228B22] group-hover:text-white">
            <ArrowUpRight
              size={19}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
