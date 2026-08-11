const variants = {
  primary: "bg-emerald-50 text-[#176B1C] border-emerald-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  dark: "bg-forest text-white border-[var(--color-forest)]",
};

export default function Badge({
  children,
  variant = "primary",
  icon,
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        "text-xs font-bold uppercase tracking-[0.12em]",
        variants[variant] ?? variants.primary,
        className,
      ].join(" ")}
    >
      {icon}
      {children}
    </span>
  );
}
