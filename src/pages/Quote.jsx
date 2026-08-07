import PageHero from "../components/ui/PageHero";

export default function Quote() {
  return (
    <>
      <PageHero eyebrow="Request a quote" title="Tell us about your cleaning or restoration project" text="The final form will send a secure notification, customer confirmation and unique EcoSurfaceCare quote reference." />
      <section className="section-space">
        <form className="container-site max-w-4xl rounded-3xl border border-slate-200 p-7 md:p-10" onSubmit={e=>e.preventDefault()}>
          <div className="grid gap-5 md:grid-cols-2">
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Full name" />
            <input className="rounded-xl border border-slate-300 px-4 py-3" type="email" placeholder="Email address" />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone number" />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Postcode" />
            <select className="rounded-xl border border-slate-300 px-4 py-3"><option>Residential property</option><option>Commercial property</option></select>
            <select className="rounded-xl border border-slate-300 px-4 py-3"><option>Select a service</option><option>Grout cleaning</option><option>Grout recolouring</option><option>BioSteam cleaning</option><option>Surface restoration</option><option>Commercial cleaning</option></select>
            <textarea className="min-h-40 rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Describe the surfaces, room and current condition" />
            <label className="rounded-xl border border-dashed border-slate-300 p-5 text-slate-600 md:col-span-2">Photo uploads will be connected here during the backend phase.<input type="file" className="mt-3 block" multiple /></label>
            <label className="flex gap-3 text-sm text-slate-600 md:col-span-2"><input type="checkbox" /> I agree that EcoSurfaceCare may use these details to respond to my enquiry.</label>
            <button className="rounded-full bg-[#228B22] px-6 py-3 font-bold text-white md:col-span-2">Request my quote</button>
          </div>
        </form>
      </section>
    </>
  );
}
