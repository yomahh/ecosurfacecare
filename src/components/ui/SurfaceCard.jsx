export default function SurfaceCard({
  children,
  className = "",
  interactive = false,
}) {
  return (
    <article
      className={[
        "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm",
        interactive
          ? "transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}
