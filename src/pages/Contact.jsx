import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import PageHero from "../components/ui/PageHero";

const contactDetails = {
  phone: "07873 945808",
  phoneHref: "+447873945808",

  email: "contact@ecosurfacecare.co.uk",

  serviceArea:
    "All BB postcode areas — Blackburn, Burnley, Darwen, Accrington, Clitheroe, Ribble Valley, Nelson, Colne and Barnoldswick",

  hours: "By appointment",

  whatsapp:
    "https://wa.me/447873945808?text=Hi%20EcoSurfaceCare%2C%20I'd%20like%20to%20make%20an%20enquiry.",
};

export default function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="How can we help?"
        text="Have a question about our services, coverage or an existing enquiry? Get in touch with EcoSurfaceCare and we'll be happy to help."
      />

      <section className="pt-10 pb-6 lg:pt-12 lg:pb-10">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* CONTACT DETAILS */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">
              Get in touch
            </p>

            <h2 className="mt-3 text-3xl font-bold text-heading">
              Speak directly with EcoSurfaceCare
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              For general questions, service-area enquiries or an existing
              booking, choose whichever contact method is easiest for you.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--color-primary-50)] text-brand">
                  <Phone size={20} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Phone
                  </p>

                  {contactDetails.phoneHref ? (
                    <a
                      href={`tel:${contactDetails.phoneHref}`}
                      className="mt-1 block font-bold text-heading transition hover:text-brand"
                    >
                      {contactDetails.phone}
                    </a>
                  ) : (
                    <p className="mt-1 font-bold text-heading">
                      {contactDetails.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--color-primary-50)] text-brand">
                  <Mail size={20} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Email
                  </p>

                  <a
  href={`mailto:${contactDetails.email}`}
  className="mt-1 block font-bold text-heading transition hover:text-brand"
>
  {contactDetails.email}
</a>
                </div>
              </div>

              <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--color-primary-50)] text-brand">
                  <MapPin size={20} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Service area
                  </p>

                  <p className="mt-1 font-bold text-heading">
                    {contactDetails.serviceArea}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--color-primary-50)] text-brand">
                  <Clock3 size={20} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Contact hours
                  </p>

                  <p className="mt-1 font-bold text-heading">
                    {contactDetails.hours}
                  </p>
                </div>
              </div>
            </div>

            {contactDetails.whatsapp && (
              <a
                href={contactDetails.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-3 rounded-full border border-[var(--color-primary-600)] px-5 py-3 font-bold text-brand transition hover:bg-[var(--color-primary-50)]"
              >
                <MessageCircle size={19} />
                Message us on WhatsApp
              </a>
            )}
          </div>

          {/* GENERAL ENQUIRY FORM */}
          <form
            className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm md:p-9"
            onSubmit={handleSubmit}
          >
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">
              General enquiry
            </p>

            <h2 className="mt-3 text-2xl font-bold text-heading">
              Send us a message
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              For project pricing, photographs and detailed job information,
              please use our dedicated quote form.
            </p>

            <div className="mt-7 grid gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  Email address
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  Phone number
                  <span className="ml-1 font-normal text-slate-400">
                    optional
                  </span>
                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  required
                  className="min-h-40 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Send enquiry
                <Send size={18} />
              </button>

              <p className="text-sm leading-6 text-slate-500">
                This form will be connected securely before the website goes
                live.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
