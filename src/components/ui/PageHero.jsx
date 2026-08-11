export default function PageHero({ eyebrow, title, text }) {
  return (
    <section className="surface-grid border-b border-emerald-100 bg-[#f5faf7]">
      <div className="container-site py-16 md:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#176B1C]">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-[#153f36] sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{text}</p>
      </div>
    </section>
  );
}
