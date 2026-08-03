import PageHero from "../components/ui/PageHero";

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Speak with EcoSurfaceCare" text="Use this page for general questions, service-area enquiries and business communication." />
      <section className="section-space">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Business details</h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p><strong className="text-slate-900">Phone:</strong> Add final number</p>
              <p><strong className="text-slate-900">Email:</strong> Add final email</p>
              <p><strong className="text-slate-900">Coverage:</strong> Add confirmed service area</p>
              <p><strong className="text-slate-900">Hours:</strong> Add opening hours</p>
            </div>
          </div>
          <form className="rounded-3xl border border-slate-200 p-7" onSubmit={e=>e.preventDefault()}>
            <div className="grid gap-5">
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Your name" />
              <input className="rounded-xl border border-slate-300 px-4 py-3" type="email" placeholder="Email address" />
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone number" />
              <textarea className="min-h-36 rounded-xl border border-slate-300 px-4 py-3" placeholder="How can we help?" />
              <button className="rounded-full bg-[#0b6f63] px-6 py-3 font-bold text-white">Send enquiry</button>
              <p className="text-sm text-slate-500">Demonstration form. Connect this to a Cloudflare Function or Worker before launch.</p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
