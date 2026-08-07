import PageHero from "../components/ui/PageHero";

export default function Cookies() {
  return (
    <>
      <PageHero
        eyebrow="Legal information"
        title="Cookie Policy"
        text="Information about how EcoSurfaceCare uses cookies and similar technologies on this website."
      />

      <section className="pt-10 pb-16 lg:pt-12 lg:pb-20">
        <div className="container-site max-w-4xl">
          <div className="space-y-10 text-slate-600">
            <section>
              <h2 className="text-2xl font-bold text-heading">
                1. What are cookies?
              </h2>

              <p className="mt-4 leading-8">
                Cookies are small text files that websites may store on your
                device. They can be used to provide essential website
                functionality, remember preferences, improve security or
                understand how a website is being used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                2. How EcoSurfaceCare uses cookies
              </h2>

              <p className="mt-4 leading-8">
                EcoSurfaceCare aims to keep the use of cookies and similar
                technologies to a minimum.
              </p>

              <p className="mt-4 leading-8">
                At present, this website does not use cookies for advertising
                or behavioural tracking.
              </p>

              <p className="mt-4 leading-8">
                Essential technologies may be used where necessary for
                security, website functionality, form protection or other
                services required for the website to operate correctly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                3. Essential cookies
              </h2>

              <p className="mt-4 leading-8">
                Essential cookies or similar technologies are used only where
                necessary to provide a service you have requested or to
                maintain the security and operation of the website.
              </p>

              <p className="mt-4 leading-8">
                These technologies do not require consent where they are
                strictly necessary for the operation of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                4. Analytics and advertising
              </h2>

              <p className="mt-4 leading-8">
                EcoSurfaceCare does not currently use optional analytics,
                advertising or behavioural tracking cookies on this website.
              </p>

              <p className="mt-4 leading-8">
                If optional analytics, advertising or other non-essential
                technologies are introduced in the future, this policy will
                be updated and an appropriate consent mechanism will be
                provided where required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                5. Third-party services
              </h2>

              <p className="mt-4 leading-8">
                Some website features may rely on third-party services for
                functions such as security, form processing, email delivery
                or hosting.
              </p>

              <p className="mt-4 leading-8">
                Where a third-party service introduces cookies or similar
                technologies that require consent, we will provide appropriate
                information and controls before those technologies are used.
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
                Blocking essential technologies may prevent some website
                features from working correctly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                7. Changes to this policy
              </h2>

              <p className="mt-4 leading-8">
                We may update this Cookie Policy if the technologies or
                services used by the EcoSurfaceCare website change. The latest
                version will always be available on this page.
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
