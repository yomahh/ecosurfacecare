import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import SurfaceCard from "../components/ui/SurfaceCard";
import Input from "../components/ui/forms/Input";
import Select from "../components/ui/forms/Select";
import Textarea from "../components/ui/forms/Textarea";
import Checkbox from "../components/ui/forms/Checkbox";

const colours = [
  ["Primary 600", "#0B6F63"],
  ["Primary 800", "#06443C"],
  ["Accent", "#53B86F"],
  ["Heading", "#17352F"],
  ["Body", "#566472"],
  ["Surface", "#F7FAF8"],
];

function KitSection({ title, description, children }) {
  return (
    <section className="border-b border-slate-200 py-14">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div>
          <h2 className="text-2xl font-bold text-[#17352f]">{title}</h2>
          {description && (
            <p className="mt-3 leading-7 text-slate-500">{description}</p>
          )}
        </div>

        <div>{children}</div>
      </div>
    </section>
  );
}

export default function UIKit() {
  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-site py-12">
          <Badge variant="primary" icon={<Sparkles size={14} />}>
            Development only
          </Badge>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#17352f] sm:text-5xl">
            EcoSurfaceCare UI Kit
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            The visual foundation for buttons, forms, cards, badges, typography
            and reusable interface elements.
          </p>
        </div>
      </header>

      <div className="container-site">
        <KitSection
          title="Colours"
          description="The main brand and interface palette."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {colours.map(([name, colour]) => (
              <div
                key={name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div
                  className="h-28"
                  style={{ backgroundColor: colour }}
                  aria-label={`${name}: ${colour}`}
                />

                <div className="p-4">
                  <p className="font-bold text-[#17352f]">{name}</p>
                  <p className="mt-1 text-sm uppercase text-slate-500">
                    {colour}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </KitSection>

        <KitSection
          title="Typography"
          description="Headings and text styles used throughout the website."
        >
          <div className="space-y-8 rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <p className="mb-2 text-sm text-slate-400">Display heading</p>
              <p className="text-5xl font-bold tracking-tight text-[#17352f]">
                Bring surfaces back to life.
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">Section heading</p>
              <p className="text-4xl font-bold tracking-tight text-[#17352f]">
                Professional surface restoration
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">Card heading</p>
              <p className="text-2xl font-bold text-[#17352f]">
                Grout recolouring
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">Body text</p>
              <p className="max-w-3xl text-lg leading-8 text-slate-600">
                Professional cleaning, restoration and maintenance for tiled
                and hard surfaces in homes and commercial environments.
              </p>
            </div>
          </div>
        </KitSection>

        <KitSection
          title="Buttons"
          description="Reusable actions for links, forms and navigation."
        >
          <div className="flex flex-wrap items-center gap-4">
            <Button icon={<ArrowRight size={18} />}>Primary action</Button>

            <Button variant="secondary">Secondary action</Button>

            <Button variant="ghost">Ghost action</Button>

            <Button variant="dark">Dark action</Button>

            <Button variant="danger">Delete</Button>

            <Button disabled>Disabled</Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </div>
        </KitSection>

        <KitSection
          title="Badges"
          description="Compact labels for services, status and trust signals."
        >
          <div className="flex flex-wrap gap-3">
            <Badge icon={<BadgeCheck size={14} />}>Authorised partner</Badge>
            <Badge variant="success" icon={<Leaf size={14} />}>
              Eco-conscious
            </Badge>
            <Badge variant="neutral">Residential</Badge>
            <Badge variant="warning">Coming soon</Badge>
            <Badge variant="dark">Commercial</Badge>
          </div>
        </KitSection>

        <KitSection
          title="Cards"
          description="Consistent containers for services and supporting content."
        >
          <div className="grid gap-6 md:grid-cols-3">
            <SurfaceCard interactive>
              <Sparkles className="text-[#0b6f63]" />
              <h3 className="mt-5 text-xl font-bold text-[#17352f]">
                Grout recolouring
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Refresh stained grout lines with a cleaner and more consistent
                finish.
              </p>
            </SurfaceCard>

            <SurfaceCard interactive>
              <ShieldCheck className="text-[#0b6f63]" />
              <h3 className="mt-5 text-xl font-bold text-[#17352f]">
                Surface restoration
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Detailed care for tiles, floors, splashbacks and hard surfaces.
              </p>
            </SurfaceCard>

            <SurfaceCard interactive>
              <Leaf className="text-[#0b6f63]" />
              <h3 className="mt-5 text-xl font-bold text-[#17352f]">
                Responsible care
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Restore existing surfaces and reduce unnecessary replacement.
              </p>
            </SurfaceCard>
          </div>
        </KitSection>

        <KitSection
          title="Forms"
          description="Inputs used by contact, quote and admin forms."
        >
          <SurfaceCard>
            <form
              className="grid gap-6 md:grid-cols-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <Input
                id="kit-name"
                label="Full name"
                placeholder="Your name"
                required
              />

              <Input
                id="kit-email"
                type="email"
                label="Email address"
                placeholder="name@example.com"
                hint="We will only use this to respond to your enquiry."
              />

              <Select id="kit-service" label="Service">
                <option value="">Select a service</option>
                <option>Grout cleaning</option>
                <option>Grout recolouring</option>
                <option>BioSteam cleaning</option>
              </Select>

              <Input
                id="kit-error"
                label="Example error"
                defaultValue="Incorrect entry"
                error="Please check this value."
              />

              <Textarea
                id="kit-message"
                label="Project details"
                placeholder="Describe the room, surface and current condition."
                className="md:col-span-2"
              />

              <Checkbox
                id="kit-consent"
                label="Contact consent"
                description="I agree that EcoSurfaceCare may use these details to respond."
                className="md:col-span-2"
              />

              <div className="md:col-span-2">
                <Button type="submit">Submit example</Button>
              </div>
            </form>
          </SurfaceCard>
        </KitSection>
      </div>
    </main>
  );
}
