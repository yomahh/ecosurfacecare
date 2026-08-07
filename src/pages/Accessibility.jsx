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
                We have designed the website with accessibility in mind,
                including:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
                <li>Clear headings and page structure.</li>
                <li>Readable colour contrast.</li>
                <li>Keyboard-accessible navigation and controls.</li>
                <li>Visible focus states for interactive elements.</li>
                <li>Descriptive labels for forms.</li>
                <li>Alternative text for meaningful images.</li>
                <li>Responsive layouts for mobile, tablet and desktop.</li>
                <li>Readable text without requiring very small font sizes.</li>
                <li>
                  Buttons and links designed to be large enough for touch use.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                3. Keyboard navigation
              </h2>

              <p className="mt-4 leading-8">
                The main website navigation, forms and interactive controls
                are intended to be usable with a keyboard without requiring a
                mouse or touchscreen.
              </p>

              <p className="mt-4 leading-8">
                We also aim to provide clear visual focus indicators so users
                can see which element is currently selected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                4. Images and video
              </h2>

              <p className="mt-4 leading-8">
                Meaningful images are provided with alternative text where
                appropriate.
              </p>

              <p className="mt-4 leading-8">
                Decorative imagery may be hidden from assistive technologies
                where it does not provide useful information.
              </p>

              <p className="mt-4 leading-8">
                Animated or video content is used carefully so that important
                information is not available only through animation or motion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                5. Forms
              </h2>

              <p className="mt-4 leading-8">
                Contact and quote forms are designed with visible labels,
                appropriate input types and clear instructions.
              </p>

              <p className="mt-4 leading-8">
                As the website backend is completed, we will also ensure that
                validation and error messages are clear and accessible to
                assistive technologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                6. Responsive design
              </h2>

              <p className="mt-4 leading-8">
                The website is designed to work across a range of screen
                sizes, including mobile phones, tablets and desktop devices.
              </p>

              <p className="mt-4 leading-8">
                Content should remain readable and usable when the browser is
                zoomed or text size is increased within reasonable limits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                7. Known limitations
              </h2>

              <p className="mt-4 leading-8">
                We are continuing to test and improve accessibility as the
                website develops. Some third-party services or future embedded
                content may have accessibility limitations that are outside
                our direct control.
              </p>

              <p className="mt-4 leading-8">
                Where practical, we will choose accessible alternatives or
                provide equivalent information in another format.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-heading">
                8. Reporting an accessibility problem
              </h2>

              <p className="mt-4 leading-8">
                If you experience difficulty using this website or need
                information in another accessible format, please contact us.
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
                We intend to review accessibility as new pages, features,
                photographs, videos and interactive services are added to the
                website.
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
