import { Camera, CheckCircle2, Send } from "lucide-react";
import { useCallback, useState } from "react";

import PageHero from "../components/ui/PageHero";
import TurnstileWidget from "../components/security/TurnstileWidget";
import { submitQuote } from "../services/api";
import SEO from "../components/seo/SEO";

export default function Quote() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
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
    setReference("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append(
      "turnstileToken",
      turnstileToken,
    );

    try {
      const result = await submitQuote(formData);

      setStatus("success");
      setMessage(result.message);
      setReference(result.reference);
      setTurnstileToken("");

      form.reset();
    } catch (error) {
      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      /*
       * Turnstile tokens are single-use, so remove the old
       * token after any submission attempt.
       */
      setTurnstileToken("");
    }
  };

  return (
    <>
    <SEO
      title="Request a Cleaning & Restoration Quote | EcoSurfaceCare"
      description="Request a quote from EcoSurfaceCare for grout cleaning, grout recolouring, BioSteam cleaning and hard-surface restoration across the BB postcode area."
      path="/request-a-quote"
    />
      <PageHero
        eyebrow="Request a quote"
        title="Tell us about your cleaning or restoration project"
        text="Tell us about the surface, its current condition and the result you're looking for. Add a few photos if possible and we'll review everything before getting back to you."
      />

      <section className="pt-10 pb-12 lg:pt-12 lg:pb-16">
        <form
          className="container-site max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm md:p-10"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">
              Project details
            </p>

            <h2 className="mt-3 text-2xl font-bold text-heading">
              Help us understand the work required
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              The more information you provide, the easier it is for us to
              understand the condition of the surface before contacting you.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* FULL NAME */}
            <div>
              <label
                htmlFor="quote-name"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Full name
              </label>

              <input
                id="quote-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                placeholder="Your full name"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="quote-email"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Email address
              </label>

              <input
                id="quote-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                placeholder="you@example.com"
              />
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="quote-phone"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Phone number
              </label>

              <input
                id="quote-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                placeholder="Your phone number"
              />
            </div>

            {/* POSTCODE */}
            <div>
              <label
                htmlFor="quote-postcode"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Postcode
              </label>

              <input
                id="quote-postcode"
                name="postcode"
                type="text"
                autoComplete="postal-code"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                placeholder="Your postcode"
              />
            </div>

            {/* PROPERTY TYPE */}
            <div>
              <label
                htmlFor="quote-property"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Property type
              </label>

              <select
                id="quote-property"
                name="propertyType"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
              >
                <option value="residential">
                  Residential property
                </option>

                <option value="commercial">
                  Commercial property
                </option>
              </select>
            </div>

            {/* SERVICE */}
            <div>
              <label
                htmlFor="quote-service"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Service required
              </label>

              <select
                id="quote-service"
                name="service"
                required
                defaultValue=""
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
              >
                <option value="" disabled>
                  Select a service
                </option>

                <option value="grout-cleaning">
                  Grout cleaning
                </option>

                <option value="grout-recolouring">
                  Grout recolouring &amp; sealing
                </option>

                <option value="biosteam">
                  BioSteam deep cleaning
                </option>

                <option value="silicone-replacement">
                  Silicone replacement
                </option>

                <option value="surface-restoration">
                  Tile &amp; surface restoration
                </option>

                <option value="bathroom">
                  Bathroom &amp; shower restoration
                </option>

                <option value="kitchen">
                  Kitchen surface care
                </option>

                <option value="floor">
                  Floor cleaning &amp; maintenance
                </option>

                <option value="commercial">
                  Commercial surface cleaning
                </option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label
                htmlFor="quote-description"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Tell us about the project
              </label>

              <textarea
                id="quote-description"
                name="description"
                required
                className="min-h-40 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[var(--color-primary-600)] focus:ring-4 focus:ring-[var(--color-primary-100)]"
                placeholder="Describe the room, surface type, current condition and what you would like improved."
              />
            </div>

            {/* PHOTOS */}
            <div className="md:col-span-2">
              <label
                htmlFor="quote-photos"
                className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-primary-400)]"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-brand shadow-sm">
                    <Camera size={22} />
                  </span>

                  <div>
                    <p className="font-bold text-heading">
                      Add photos of the area
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Photos help us understand the surface and provide a more
                      accurate response.
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Optional · Up to 5 photos · Maximum 12 MB per photo
                    </p>
                  </div>
                </div>

                <input
                  id="quote-photos"
                  name="photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  multiple
                  className="mt-4 block w-full text-sm text-slate-600"
                />
              </label>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                JPG, PNG, WebP, HEIC and HEIF images are supported. Photos are
                used to help us assess your project and respond to your quote
                request.
              </p>
            </div>

            {/* SECURITY CHECK */}
            <div className="md:col-span-2">
              <p className="mb-3 text-sm font-semibold text-heading">
                Security check
              </p>

              <TurnstileWidget
                onVerify={handleTurnstileVerify}
                onExpire={handleTurnstileExpire}
                onError={handleTurnstileError}
              />
            </div>

            {/* CONSENT */}
            <label className="flex items-start gap-3 text-sm leading-6 text-slate-600 md:col-span-2">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary-600)]"
              />

              <span>
                I agree that EcoSurfaceCare may use these details and any
                photographs I provide to respond to my quote request.
              </span>
            </label>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={
                status === "submitting" ||
                !turnstileToken
              }
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {status === "submitting" ? (
                "Sending..."
              ) : (
                <>
                  Send my quote request
                  <Send size={18} />
                </>
              )}
            </button>

            {/* SUCCESS MESSAGE */}
            {status === "success" && (
              <div
                className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800 md:col-span-2"
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
                      Quote request received
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      {message}
                    </p>

                    {reference && (
                      <p className="mt-2 text-sm font-semibold">
                        Reference: {reference}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {status === "error" && (
              <div
                className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 md:col-span-2"
                role="alert"
                aria-live="assertive"
              >
                {message}
              </div>
            )}

            {/* PRIVACY */}
            <p className="text-center text-sm leading-6 text-slate-500 md:col-span-2">
              Your details and photographs will only be used to process and
              respond to your enquiry.
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
