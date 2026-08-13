import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Play,
  RefreshCw,
  X,
} from "lucide-react";

import PageHero from "../components/ui/PageHero";
import SEO from "../components/seo/SEO";

const categoryLabels = {
  "grout-cleaning":
    "Grout Cleaning",

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

function ProjectMedia({
  project,
  onOpen,
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
      <button
        type="button"
        onClick={onOpen}
        className="group relative block aspect-square w-full overflow-hidden bg-slate-900"
        aria-label={`Open ${project.title}`}
      >
        <video
          src={media.url}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />

        <span className="absolute inset-0 grid place-items-center bg-black/20 transition group-hover:bg-black/30">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-[#176B1C] shadow-lg">
            <Play
              size={26}
              fill="currentColor"
            />
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block aspect-square w-full overflow-hidden bg-slate-100"
      aria-label={`Open ${project.title}`}
    >
      <img
        src={media.url}
        alt={
          media.alt_text ||
          project.title
        }
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
    </button>
  );
}

function ProjectLightbox({
  project,
  mediaIndex,
  onClose,
  onPrevious,
  onNext,
  onSelect,
}) {
  if (!project) {
    return null;
  }

  const media =
    project.media || [];

  const activeMedia =
    media[mediaIndex];

  if (!activeMedia) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/95"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} gallery`}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <div className="flex items-center justify-between gap-4 text-white">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
              {friendlyCategory(
                project.category,
              )}
            </p>

            <h2 className="mt-1 truncate text-lg font-bold sm:text-xl">
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close project gallery"
          >
            <X size={24} />
          </button>
        </div>

        {/* MAIN MEDIA */}
        <div className="relative mt-5 flex min-h-[55vh] flex-1 items-center justify-center overflow-hidden rounded-3xl bg-black">
          {activeMedia.media_type ===
          "video" ? (
            <video
              key={activeMedia.id}
              src={activeMedia.url}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-h-[72vh] max-w-full object-contain"
            >
              Your browser does not
              support video playback.
            </video>
          ) : (
            <img
              key={activeMedia.id}
              src={activeMedia.url}
              alt={
                activeMedia.alt_text ||
                project.title
              }
              className="max-h-[72vh] max-w-full object-contain"
            />
          )}

          {/* PREVIOUS / NEXT */}
          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={
                  onPrevious
                }
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:left-5"
                aria-label="Previous media"
              >
                <ChevronLeft
                  size={28}
                />
              </button>

              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:right-5"
                aria-label="Next media"
              >
                <ChevronRight
                  size={28}
                />
              </button>
            </>
          )}

          {/* COUNTER */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-sm font-bold text-white backdrop-blur">
            {mediaIndex + 1} /{" "}
            {media.length}
          </div>
        </div>

        {/* THUMBNAILS */}
        {media.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {media.map(
              (item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onSelect(index)
                  }
                  className={[
                    "relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-800 transition",
                    index ===
                    mediaIndex
                      ? "border-emerald-400"
                      : "border-transparent opacity-70 hover:opacity-100",
                  ].join(" ")}
                  aria-label={`View media ${
                    index + 1
                  }`}
                >
                  {item.media_type ===
                  "video" ? (
                    <>
                      <video
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute inset-0 grid place-items-center bg-black/25 text-white">
                        <Play
                          size={20}
                          fill="currentColor"
                        />
                      </span>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              ),
            )}
          </div>
        )}

        {/* PROJECT DETAILS */}
        <div className="mt-4 rounded-2xl bg-white/5 p-5 text-white">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="font-bold text-emerald-300">
              {friendlyCategory(
                project.category,
              )}
            </p>

            {project.location && (
              <p className="text-slate-300">
                {project.location}
              </p>
            )}
          </div>

          {project.description && (
            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              {
                project.description
              }
            </p>
          )}

          {activeMedia.alt_text && (
            <p className="mt-3 text-sm text-slate-400">
              {
                activeMedia.alt_text
              }
            </p>
          )}
        </div>
      </div>
    </div>
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

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [
    selectedMediaIndex,
    setSelectedMediaIndex,
  ] = useState(0);

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

  function openProject(project) {
    if (
      !project.media ||
      project.media.length === 0
    ) {
      return;
    }

    setSelectedProject(
      project,
    );

    setSelectedMediaIndex(0);
  }

  function closeProject() {
    setSelectedProject(null);
    setSelectedMediaIndex(0);
  }

  function showPreviousMedia() {
    if (!selectedProject) {
      return;
    }

    const total =
      selectedProject.media.length;

    setSelectedMediaIndex(
      (current) =>
        (current -
          1 +
          total) %
        total,
    );
  }

  function showNextMedia() {
    if (!selectedProject) {
      return;
    }

    const total =
      selectedProject.media.length;

    setSelectedMediaIndex(
      (current) =>
        (current + 1) %
        total,
    );
  }

  useEffect(() => {
    loadProjects();
  }, []);

  /*
   * Keyboard controls and
   * scroll lock while the
   * gallery is open.
   */
  useEffect(() => {
    if (!selectedProject) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const total =
      selectedProject.media
        ?.length || 0;

    function handleKeyDown(
      event,
    ) {
      if (
        event.key === "Escape"
      ) {
        setSelectedProject(
          null,
        );

        setSelectedMediaIndex(
          0,
        );

        return;
      }

      if (
        event.key ===
          "ArrowLeft" &&
        total > 1
      ) {
        setSelectedMediaIndex(
          (current) =>
            (current -
              1 +
              total) %
            total,
        );
      }

      if (
        event.key ===
          "ArrowRight" &&
        total > 1
      ) {
        setSelectedMediaIndex(
          (current) =>
            (current + 1) %
            total,
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [selectedProject]);

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
          project.category ===
          active,
      );
    }, [active, projects]);

  useEffect(() => {
    if (
      active !== "All" &&
      !categories.includes(
        active,
      )
    ) {
      setActive("All");
    }
  }, [active, categories]);

  return (
    <>
      <SEO
        title="Surface Cleaning & Restoration Projects | EcoSurfaceCare"
        description="See real EcoSurfaceCare grout cleaning, recolouring, silicone replacement and surface restoration projects completed across Burnley, Blackburn and surrounding BB postcode areas."
        path="/our-work"
      />

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
                New projects coming
                soon
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-slate-500">
                We&apos;ll be adding
                completed
                EcoSurfaceCare
                projects here as they
                are published.
              </p>
            </div>
          ) : (
            <>
              {/* FILTERS */}
              <div className="flex flex-wrap gap-3">
                {categories.map(
                  (category) => (
                    <button
                      key={
                        category
                      }
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
                        onOpen={() =>
                          openProject(
                            project,
                          )
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

                        <div className="mt-5 flex flex-wrap items-center gap-4">
                          {project.media
                            ?.length >
                            0 && (
                            <button
                              type="button"
                              onClick={() =>
                                openProject(
                                  project,
                                )
                              }
                              className="inline-flex items-center gap-2 text-sm font-bold text-[#176B1C] transition hover:text-[#0f5515]"
                            >
                              {project
                                .media
                                .length ===
                              1
                                ? "View photo"
                                : `View all ${project.media.length} media items`}
                            </button>
                          )}

                          <Link
                            to={`/our-work/${project.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-[#176B1C]"
                          >
                            View project

                            <span
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>

              {visibleProjects.length ===
                0 && (
                <div className="mt-10 rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
                  No published
                  projects are
                  available in this
                  category yet.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <ProjectLightbox
        project={
          selectedProject
        }
        mediaIndex={
          selectedMediaIndex
        }
        onClose={
          closeProject
        }
        onPrevious={
          showPreviousMedia
        }
        onNext={
          showNextMedia
        }
        onSelect={
          setSelectedMediaIndex
        }
      />
    </>
  );
}
