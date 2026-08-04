import { ArrowRight } from "lucide-react";
import { services } from "../../data/services";
import Button from "../ui/Button";
import ServiceCard from "../ui/ServiceCard";
import SectionHeading from "../ui/SectionHeading";

export default function ServicesPreview() {
  const featuredServices = services.slice(0, 6);

  return (
    <section className="section-space bg-white">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Our services"
            title="Specialist care for grout, tiles and hard surfaces"
            text="Professional cleaning and restoration services designed to improve appearance, hygiene and the useful life of existing surfaces."
          />

          <Button
            to="/services"
            variant="secondary"
            icon={<ArrowRight size={18} />}
            className="self-start lg:mb-1 lg:self-auto"
          >
            View all services
          </Button>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {featuredServices.map((service, index) => (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              title={service.title}
              description={service.short}
              features={service.features}
              icon={service.icon}
              featured={index === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
