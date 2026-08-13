import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import Button from "../ui/Button";
import ProjectCard from "../ui/ProjectCard";
import SectionHeading from "../ui/SectionHeading";
import { galleryImageUrl } from "../../utils/galleryImage";

const categoryLabels = {
  "grout-cleaning": "Grout Cleaning",

  "grout-recolouring":
    "Grout Recolouring",

  "silicone-replacement":
    "Silicone Replacement",

  biosteam:
    "BioSteam Deep Cleaning",

  "surface-restoration":
    "Tile & Surface Restoration",

  bathroom:
    "Bathroom & Shower Restoration",

  kitchen:
    "Kitchen Surface Care",

  floor:
    "Floor Cleaning & Maintenance",

  commercial:
    "Commercial Surface Cleaning",
};

function friendlyCategory(value = "") {
  return (
    categoryLabels[value] ||
    String(value)
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      )
  );
}

export default function WorkPreview() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          "/api/gallery",
          {
            method: "GET",

            headers: {
              Accept:
                "application/json",
            },
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to load projects.",
        );
      }

      setProjects(
        data.projects || [],
      );
    } catch (err) {
      console.error(
        "Homepage work preview error:",
        err,
      );

      setError(
        "Unable to load recent projects.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const featuredProjects =
    useMemo(() => {
      return projects
        .filter(
          (project) =>
            project.media?.length >
            0,
        )
        .slice(0, 3)
        .map((project) => ({
          id: project.id,

          slug:
            project.slug,

          title:
            project.title,

          category:
            friendlyCategory(
              project.category,
            ),

          location:
            project.location ||
            "Lancashire",

          image:
  project.media[0].media_type === "image"
    ? galleryImageUrl(
        project.media[0].url,
        {
          width: 900,
          quality: 80,
        },
      )
    : project.media[0].url,

          to:
            `/our-work/${project.slug}`,
        }));
    }, [projects]);

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
            icon={
              <ArrowRight
                size={18}
              />
            }
            className="self-start lg:mb-1 lg:self-auto"
          >
            View all projects
          </Button>
        </div>

        {loading && (
          <div className="mt-12 flex min-h-60 items-center justify-center rounded-[2rem] border border-slate-200 bg-white">
            <div className="text-center">
              <RefreshCw
                size={24}
                className="mx-auto animate-spin text-[#176B1C]"
              />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading recent projects...
              </p>
            </div>
          </div>
        )}

        {!loading &&
          error && (
            <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold text-slate-600">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadProjects
                }
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-bold text-[#176B1C]"
              >
                <RefreshCw
                  size={17}
                />

                Try again
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          featuredProjects.length >
            0 && (
            <div className="mt-12 grid gap-7 lg:grid-cols-2">
              {featuredProjects.map(
                (
                  project,
                  index,
                ) => (
                  <div
                    key={
                      project.id
                    }
                    className={
                      index === 0
                        ? "lg:row-span-2"
                        : ""
                    }
                  >
                    <ProjectCard
                      {...project}
                      featured={
                        index === 0
                      }
                    />
                  </div>
                ),
              )}
            </div>
          )}

        {!loading &&
          !error &&
          featuredProjects.length ===
            0 && (
            <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold text-slate-600">
                Published project
                photos will appear
                here soon.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}
