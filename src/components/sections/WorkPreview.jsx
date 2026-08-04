import { ArrowRight } from "lucide-react";
import { galleryItems } from "../../data/gallery";
import Button from "../ui/Button";
import ProjectCard from "../ui/ProjectCard";
import SectionHeading from "../ui/SectionHeading";

export default function WorkPreview() {
  const featuredProjects = galleryItems.slice(0, 3);

  return (
    <section className="section-space bg-[#f5faf7]">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Our work"
            title="Real projects. Visible transformations."
            text="Explore examples of grout recolouring, deep cleaning and professional surface restoration completed for homes and commercial spaces."
          />

          <Button
            to="/our-work"
            variant="secondary"
            icon={<ArrowRight size={18} />}
            className="self-start lg:mb-1 lg:self-auto"
          >
            View all projects
          </Button>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <div
              key={project.id}
              className={index === 0 ? "lg:row-span-2" : ""}
            >
              <ProjectCard
                {...project}
                featured={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
