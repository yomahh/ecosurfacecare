import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useCallback, useState } from "react";

import PageHero from "../components/ui/PageHero";
import TurnstileWidget from "../components/security/TurnstileWidget";
import { submitContact } from "../services/api";
import SEO from "../components/seo/SEO";

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
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleTurnstileVerify = useCallback((token) => {
    setTurnstileToken(token);

    setStatus((current) =>
      current === "error" ? "idle" : current,
    );
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken("");
    setStatus("error");
    setMessage(
      "The security check could not be completed. Please try again.",
    );
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!turnstileToken) {
      setStatus("error");
      setMessage("Please complete the security check.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim(),
      message: formData.get("message")?.trim(),
      turnstileToken,
    };

    try {
      const result = await submitContact(payload);

      setStatus("success");
      setMessage(result.message);
      setTurnstileToken("");

      form.reset();
    } catch (error) {
      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      setTurnstileToken("");
    }
  };

  return (
    <>
    <SEO
      title="Contact EcoSurfaceCare | Burnley & Blackburn"
      description="Contact EcoSurfaceCare for grout cleaning, recolouring, surface restoration and specialist cleaning enquiries across Burnley, Blackburn and the wider BB postcode area."
      path="/contact"
    />
      <PageHero
        eyebrow="Contact"
        title="How can we help?"
        text="Have a question about our services, coverage or an existing enquiry? Get in touch with EcoSurfaceCare and we'll be happy to help."
      />

      <section className="pt-10 pb-6 lg:pt-12 lg:pb-10">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
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

                  <a
                    href={`tel:${contactDetails.phoneHref}`}
                    className="mt-1 block font-bold text-heading transition hover:text-brand"
                  >
                    {contactDetails.phone}
                  </a>
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

            <a
              href={contactDetails.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-3 rounded-full border border-[var(--color-primary-600)] px-5 py-3 font-bold text-brand transition hover:bg-[var(--color-primary-50)]"
            >
              <MessageCircle size={19} />
              Message us on WhatsApp
            </a>
          </div>

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

              <div>
                <p className="mb-3 text-sm font-semibold text-heading">
                  Security check
                </p>

                <TurnstileWidget
                  onVerify={handleTurnstileVerify}
                  onExpire={handleTurnstileExpire}
                  onError={handleTurnstileError}
                />
              </div>

              <button
                type="submit"
                disabled={
                  status === "submitting" ||
                  !turnstileToken
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? (
                  "Sending..."
                ) : (
                  <>
                    Send enquiry
                    <Send size={18} />
                  </>
                )}
              </button>

              {status === "success" && (
                <div
                  className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={22}
                      className="mt-0.5 shrink-0"
                    />

                    <div>
                      <p className="font-bold">
                        Message sent
                      </p>

                      <p className="mt-1 text-sm leading-6">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div
                  className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
                  role="alert"
                  aria-live="assertive"
                >
                  {message}
                </div>
              )}

              <p className="text-sm leading-6 text-slate-500">
                Your details will only be used to respond to your enquiry.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
