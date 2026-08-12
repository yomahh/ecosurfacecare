import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ImageOff,
  RefreshCw,
} from "lucide-react";
import PageHero from "../components/ui/PageHero";

const categoryLabels = {
  "grout-cleaning": "Grout Cleaning",
  "grout-recolouring":
    "Grout Recolouring",
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

function ProjectMedia({
  project,
}) {
  const media =
    project.media?.[0];

  if (!media) {
    return (
      <div className="grid aspect-square w-full place-items-center bg-slate-100 text-slate-400">
        <div className="text-center">
          <ImageOff
            size={34}
            className="mx-auto"
          />

          <p className="mt-3 text-sm font-semibold">
            No media available
          </p>
        </div>
      </div>
    );
  }

  if (
    media.media_type === "video"
  ) {
    return (
      <video
        src={media.url}
        controls
        preload="metadata"
        className="aspect-square w-full bg-slate-100 object-cover"
      >
        Your browser does not support
        video playback.
      </video>
    );
  }

  return (
    <img
      src={media.url}
      alt={
        media.alt_text ||
        project.title
      }
      loading="lazy"
      decoding="async"
      className="aspect-square w-full object-cover"
    />
  );
}

export default function OurWork() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [active, setActive] =
    useState("All");

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
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
        "Our Work gallery error:",
        err,
      );

      setError(
        "We couldn't load our recent projects right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const categories =
    useMemo(() => {
      const uniqueCategories = [
        ...new Set(
          projects.map(
            (project) =>
              project.category,
          ),
        ),
      ];

      return [
        "All",
        ...uniqueCategories,
      ];
    }, [projects]);

  const visibleProjects =
    useMemo(() => {
      if (active === "All") {
        return projects;
      }

      return projects.filter(
        (project) =>
          project.category === active,
      );
    }, [
      active,
      projects,
    ]);

  /*
   * If a category disappears after
   * refreshing the gallery, return
   * automatically to All.
   */
  useEffect(() => {
    if (
      active !== "All" &&
      !categories.includes(active)
    ) {
      setActive("All");
    }
  }, [
    active,
    categories,
  ]);

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Real surface transformations and completed projects"
        text="Explore cleaning, grout recolouring and restoration work completed for residential and commercial spaces."
      />

      <section className="pt-10 pb-6 lg:pt-12 lg:pb-10">
        <div className="container-site">
          {loading &&
          projects.length === 0 ? (
            <div className="grid min-h-72 place-items-center rounded-3xl border border-slate-200 bg-white">
              <div className="text-center">
                <RefreshCw
                  size={26}
                  className="mx-auto animate-spin text-[#176B1C]"
                />

                <p className="mt-4 font-semibold text-slate-600">
                  Loading our work...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadProjects
                }
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#228B22] px-5 font-bold text-white"
              >
                <RefreshCw
                  size={17}
                />

                Try again
              </button>
            </div>
          ) : projects.length ===
            0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
              <ImageOff
                size={38}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 text-xl font-bold">
                New projects coming soon
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-slate-500">
                We&apos;ll be adding
                completed EcoSurfaceCare
                projects here as they are
                published.
              </p>
            </div>
          ) : (
            <>
              {/* FILTERS */}
              <div className="flex flex-wrap gap-3">
                {categories.map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setActive(
                          category,
                        )
                      }
                      className={[
                        "rounded-full px-5 py-2.5 font-semibold transition",
                        active ===
                        category
                          ? "bg-[#228B22] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                      ].join(" ")}
                    >
                      {category ===
                      "All"
                        ? "All"
                        : friendlyCategory(
                            category,
                          )}
                    </button>
                  ),
                )}
              </div>

              {/* PROJECT GRID */}
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map(
                  (project) => (
                    <article
                      key={
                        project.id
                      }
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >
                      <ProjectMedia
                        project={
                          project
                        }
                      />

                      <div className="p-6">
                        <p className="text-sm font-bold text-[#176B1C]">
                          {friendlyCategory(
                            project.category,
                          )}
                        </p>

                        <h2 className="mt-2 text-xl font-bold text-slate-900">
                          {
                            project.title
                          }
                        </h2>

                        {project.location && (
                          <p className="mt-2 text-slate-500">
                            {
                              project.location
                            }
                          </p>
                        )}

                        {project.description && (
                          <p className="mt-4 leading-7 text-slate-600">
                            {
                              project.description
                            }
                          </p>
                        )}

                        {project.media
                          ?.length >
                          1 && (
                          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {
                              project
                                .media
                                .length
                            }{" "}
                            media items
                          </p>
                        )}
                      </div>
                    </article>
                  ),
                )}
              </div>

              {visibleProjects.length ===
                0 && (
                <div className="mt-10 rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
                  No published projects
                  are available in this
                  category yet.
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
