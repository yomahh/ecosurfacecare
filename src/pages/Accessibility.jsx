import PageHero from "../components/ui/PageHero";

export default function Accessibility() {
  return (
    <>
      <PageHero
        eyebrow="Legal information"
        title="Accessibility Statement"
        text="Our commitment to making the EcoSurfaceCare website clear, usable and accessible to as many people as possible."
      />

      <section className="pt-10 pb-16 lg:pt-12 lg:pb-20">
        <div className="container-site max-w-4xl">
          <div className="space-y-10 text-slate-600">
            <section>
              <h2 className="text-2xl font-bold text-heading">
                1. Our commitment
              </h2>

              <p className="mt-4 leading-8">
                EcoSurfaceCare aims to provide a website that is clear,
                understandable and usable for as many people as reasonably
                possible, including people who use assistive technologies.
              </p>

              <p className="mt-4 leading-8">
                Accessibility is considered as part of the design,
                development and ongoing maintenance of this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                2. Accessibility features
              </h2>

              <p className="mt-4 leading-8">
                We have designed the website with accessibility in mind.
                Features include:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
                <li>Clear headings and page structure.</li>
                <li>Readable colour contrast.</li>
                <li>Keyboard-accessible navigation and controls.</li>
                <li>Visible focus states for interactive elements.</li>
                <li>Descriptive labels and instructions for forms.</li>
                <li>Alternative text for meaningful images.</li>
                <li>Responsive layouts for mobile, tablet and desktop.</li>
                <li>
                  Text designed to remain readable at different screen
                  sizes and zoom levels.
                </li>
                <li>
                  Buttons and links designed to provide practical touch
                  targets on mobile devices.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                3. Keyboard navigation
              </h2>

              <p className="mt-4 leading-8">
                The main website navigation, forms, links and interactive
                controls are intended to be usable with a keyboard without
                requiring a mouse or touchscreen.
              </p>

              <p className="mt-4 leading-8">
                We aim to provide visible focus indicators so that keyboard
                users can identify which interactive element is currently
                selected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                4. Images and media
              </h2>

              <p className="mt-4 leading-8">
                Meaningful images are provided with alternative text where
                appropriate. Decorative images may be hidden from assistive
                technologies where they do not provide useful information.
              </p>

              <p className="mt-4 leading-8">
                Project photographs and other visual content are intended to
                supplement written information rather than being the only
                way important information is communicated.
              </p>

              <p className="mt-4 leading-8">
                Where video or animated content is used, we aim to avoid
                relying on motion alone to communicate essential information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                5. Forms
              </h2>

              <p className="mt-4 leading-8">
                Contact and quote forms are designed with visible labels,
                appropriate input types and instructions to help users
                understand the information being requested.
              </p>

              <p className="mt-4 leading-8">
                Form validation and error messages are designed to provide
                clear feedback when information is missing, invalid or
                cannot be submitted successfully.
              </p>

              <p className="mt-4 leading-8">
                Security checks used to protect forms from automated abuse
                are provided through third-party security technology and may
                behave differently depending on the browser, device or
                assistive technology being used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                6. Responsive design and zoom
              </h2>

              <p className="mt-4 leading-8">
                The website is designed to work across a range of screen
                sizes, including mobile phones, tablets and desktop devices.
              </p>

              <p className="mt-4 leading-8">
                Content is intended to remain readable and usable when
                browser zoom or text size is increased within reasonable
                limits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                7. Third-party services and known limitations
              </h2>

              <p className="mt-4 leading-8">
                Some functionality, including security and form-protection
                services, may be provided by third parties. Although we aim
                to choose appropriate services, some aspects of their
                accessibility may be outside our direct control.
              </p>

              <p className="mt-4 leading-8">
                We continue to review the website as content and features
                change. If we identify an accessibility issue, we will aim
                to correct it where reasonably practical.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                8. Reporting an accessibility problem
              </h2>

              <p className="mt-4 leading-8">
                If you experience difficulty using this website or need
                information provided in another accessible format, please
                contact us and tell us what you need.
              </p>

              <p className="mt-4 leading-8">
                Email{" "}
                <a
                  href="mailto:contact@ecosurfacecare.co.uk"
                  className="font-semibold text-brand hover:underline"
                >
                  contact@ecosurfacecare.co.uk
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+447873945808"
                  className="font-semibold text-brand hover:underline"
                >
                  07873 945808
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                9. Ongoing improvements
              </h2>

              <p className="mt-4 leading-8">
                We intend to review accessibility as new pages, project
                photographs, videos and interactive features are added or
                changed.
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
