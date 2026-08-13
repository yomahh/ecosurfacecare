import PageHero from "../components/ui/PageHero";

export default function Cookies() {
  return (
    <>
      <PageHero
        eyebrow="Legal information"
        title="Cookie Policy"
        text="Information about cookies and similar technologies used by the EcoSurfaceCare website."
      />

      <section className="pt-10 pb-16 lg:pt-12 lg:pb-20">
        <div className="container-site max-w-4xl">
          <div className="space-y-10 text-slate-600">
            <section>
              <h2 className="text-2xl font-bold text-heading">
                1. What are cookies?
              </h2>

              <p className="mt-4 leading-8">
                Cookies are small text files that websites may place on your
                device. Similar technologies can also be used to provide
                website functionality, maintain security, remember settings
                or understand technical website activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                2. How EcoSurfaceCare uses these technologies
              </h2>

              <p className="mt-4 leading-8">
                EcoSurfaceCare aims to keep the use of cookies and similar
                technologies to a minimum.
              </p>

              <p className="mt-4 leading-8">
                The public website does not use cookies for personalised
                advertising or behavioural advertising.
              </p>

              <p className="mt-4 leading-8">
                Security and technical technologies may be used where
                necessary to protect the website, prevent automated abuse,
                process forms and maintain reliable website operation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                3. Strictly necessary technologies
              </h2>

              <p className="mt-4 leading-8">
                Strictly necessary technologies may be used where required
                to provide a service requested by the user or to protect the
                security and operation of the website.
              </p>

              <p className="mt-4 leading-8">
                These may include technologies used by Cloudflare to provide
                security, traffic protection and form-abuse prevention,
                including Cloudflare Turnstile.
              </p>

              <p className="mt-4 leading-8">
                Strictly necessary technologies do not normally require
                consent where their use is essential to provide the requested
                service or maintain website security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                4. Analytics
              </h2>

              <p className="mt-4 leading-8">
                EcoSurfaceCare may receive limited technical information
                about website traffic and performance through its hosting
                and security infrastructure.
              </p>

              <p className="mt-4 leading-8">
                We do not use this website to build advertising profiles of
                visitors or to carry out behavioural advertising.
              </p>

              <p className="mt-4 leading-8">
                If we introduce optional analytics or other non-essential
                tracking technologies that require consent in the future,
                this policy will be updated and an appropriate consent
                mechanism will be provided before those technologies are
                used where required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                5. Third-party services
              </h2>

              <p className="mt-4 leading-8">
                EcoSurfaceCare uses third-party infrastructure and service
                providers to operate and secure the website.
              </p>

              <p className="mt-4 leading-8">
                Cloudflare provides website delivery, security and
                form-protection services. Other service providers may be
                involved in processing information submitted through the
                website, such as transactional email delivery.
              </p>

              <p className="mt-4 leading-8">
                Third-party services operate according to their own
                technical and privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                6. Managing cookies
              </h2>

              <p className="mt-4 leading-8">
                Most web browsers allow you to view, delete or block cookies
                through their privacy and security settings.
              </p>

              <p className="mt-4 leading-8">
                Blocking technologies that are necessary for website
                security or functionality may prevent some features,
                including protected forms, from working correctly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                7. Changes to this policy
              </h2>

              <p className="mt-4 leading-8">
                We may update this Cookie Policy when the technologies or
                services used by the EcoSurfaceCare website change. The
                latest version will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                8. Contact us
              </h2>

              <p className="mt-4 leading-8">
                If you have questions about this Cookie Policy, contact
                EcoSurfaceCare at{" "}
                <a
                  href="mailto:contact@ecosurfacecare.co.uk"
                  className="font-semibold text-brand hover:underline"
                >
                  contact@ecosurfacecare.co.uk
                </a>
                .
              </p>
            </section>

            <p className="border-t border-slate-200 pt-6 text-sm text-slate-500">
              Last updated: August 2026
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
