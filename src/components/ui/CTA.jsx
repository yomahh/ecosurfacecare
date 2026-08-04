import {
  ArrowRight,
  BadgeCheck,
  Camera,
  MessageSquareText,
} from "lucide-react";
import Button from "./Button";

const steps = [
  {
    icon: MessageSquareText,
    title: "Tell us what you need",
    text: "Share the room, surface and current condition.",
  },
  {
    icon: Camera,
    title: "Add helpful photos",
    text: "Photos help us understand the project before we contact you.",
  },
  {
    icon: BadgeCheck,
    title: "Receive the next step",
    text: "We will review the details and respond with the best way forward.",
  },
];

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#f5faf7]">
      <div
        aria-hidden="true"
        className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"
      />

      <div className="container-site relative py-16 md:py-24">
        <div className="overflow-hidden rounded-[2.25rem] bg-[#0b6f63] shadow-[0_28px_80px_rgba(23,53,47,0.18)]">
          <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_.9fr] lg:p-14">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
                Request a free quote
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to bring your surfaces back to life?
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/85">
                Tell us what needs attention and include photographs where
                possible. We’ll review the details and contact you about the
                most suitable next step.
              </p>

              <Button
                to="/request-a-quote"
                variant="secondary"
                size="large"
                icon={<ArrowRight size={19} />}
                className="mt-8 border-white bg-white text-[#0b6f63] hover:bg-emerald-50"
              >
                Start your quote
              </Button>
            </div>

            <div className="grid gap-4">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <article
                  key={title}
                  className="flex gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#0b6f63]">
                    <Icon size={21} />
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">
                      Step {index + 1}
                    </p>

                    <h3 className="mt-1 font-bold text-white">{title}</h3>

                    <p className="mt-1 text-sm leading-6 text-emerald-50/70">
                      {text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
