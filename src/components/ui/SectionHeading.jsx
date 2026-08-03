export default function SectionHeading({ eyebrow, title, text, align = "center" }) {
  const alignment = align === "left" ? "text-left" : "text-center mx-auto";
  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#0b6f63]">{eyebrow}</p>}
      <h2 className="text-3xl font-bold tracking-tight text-[#153f36] sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg leading-8 text-slate-600">{text}</p>}
    </div>
  );
}
