import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  MapPin,
  Play,
  RefreshCw,
  X,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import SEO from "../components/seo/SEO";
import PageHero from "../components/ui/PageHero";
import { galleryImageUrl } from "../utils/galleryImage";

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

function friendlyCategory(
  value = "",
) {
  return (
    categoryLabels[value] ||
    String(value)
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      )
  );
}

function Lightbox({
  project,
  index,
  onClose,
  onPrevious,
  onNext,
  onSelect,
}) {
  const media =
    project?.media || [];

  const activeMedia =
    media[index];

  if (
    !project ||
    !activeMedia
  ) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/95"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} gallery`}
    >
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
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
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>
        </div>

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
  src={galleryImageUrl(
    activeMedia.url,
    {
      width: 1600,
      quality: 85,
    },
  )}
  alt={
    activeMedia.alt_text ||
    project.title
  }
  className="max-h-[72vh] max-w-full object-contain"
/>
          )}

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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-sm font-bold text-white backdrop-blur">
            {index + 1} /{" "}
            {media.length}
          </div>
        </div>

        {media.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {media.map(
              (item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onSelect(
                      itemIndex,
                    )
                  }
                  className={[
                    "relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-800 transition",
                    itemIndex ===
                    index
                      ? "border-emerald-400"
                      : "border-transparent opacity-70 hover:opacity-100",
                  ].join(" ")}
                  aria-label={`View media ${
                    itemIndex + 1
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
                          size={18}
                          fill="currentColor"
                        />
                      </span>
                    </>
                  ) : (
                    <img
  src={galleryImageUrl(
    item.url,
    {
      width: 300,
      quality: 75,
    },
  )}
  alt=""
  loading="lazy"
  decoding="async"
  className="h-full w-full object-cover"
/>
                  )}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } =
    useParams();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedMediaIndex,
    setSelectedMediaIndex,
  ] = useState(null);

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `/api/gallery/${encodeURIComponent(
              slug,
            )}`,
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
              "Unable to load project.",
          );
        }

        setProject(
          data.project,
        );
      } catch (err) {
        console.error(
          "Project page error:",
          err,
        );

        setError(
          err.message ||
            "Unable to load this project.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [slug]);

  useEffect(() => {
    if (
      selectedMediaIndex ===
      null
    ) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const total =
      project?.media?.length ||
      0;

    function handleKeyDown(
      event,
    ) {
      if (
        event.key === "Escape"
      ) {
        setSelectedMediaIndex(
          null,
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
  }, [
    selectedMediaIndex,
    project,
  ]);

  function previousMedia() {
    const total =
      project?.media?.length ||
      0;

    if (total <= 1) {
      return;
    }

    setSelectedMediaIndex(
      (current) =>
        (current -
          1 +
          total) %
        total,
    );
  }

  function nextMedia() {
    const total =
      project?.media?.length ||
      0;

    if (total <= 1) {
      return;
    }

    setSelectedMediaIndex(
      (current) =>
        (current + 1) %
        total,
    );
  }

  if (loading) {
    return (
      <section className="section-space">
        <div className="container-site grid min-h-72 place-items-center">
          <div className="text-center">
            <RefreshCw
              className="mx-auto animate-spin text-[#176B1C]"
            />

            <p className="mt-4 font-semibold text-slate-600">
              Loading project...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (
    error ||
    !project
  ) {
    return (
      <>
        <SEO
          title="Project Not Found | EcoSurfaceCare"
          description="The requested EcoSurfaceCare project could not be found."
          path={`/our-work/${slug || ""}`}
          noindex
        />

        <PageHero
          eyebrow="Our Work"
          title="Project not found"
          text="This project may no longer be available."
        />

        <section className="section-space">
          <div className="container-site text-center">
            <Link
              to="/our-work"
              className="inline-flex items-center gap-2 rounded-full bg-[#228B22] px-5 py-3 font-bold text-white"
            >
              <ArrowLeft
                size={18}
              />

              Return to Our Work
            </Link>
          </div>
        </section>
      </>
    );
  }

  const category =
    friendlyCategory(
      project.category,
    );

  const seoLocation =
    project.location
      ? ` in ${project.location}`
      : "";

  const seoTitle =
    `${project.title}${seoLocation} | EcoSurfaceCare`;

  const seoDescription =
    project.description ||
    `View this ${category.toLowerCase()} project completed by EcoSurfaceCare${seoLocation}.`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={
          seoDescription
        }
        path={`/our-work/${project.slug}`}
        image={
          project.media?.[0]?.url
            ? `https://ecosurfacecare.co.uk${project.media[0].url}`
            : undefined
        }
      />

      <PageHero
        eyebrow={category}
        title={project.title}
        text={
          project.description ||
          "Explore this completed EcoSurfaceCare project."
        }
      />

      <section className="pt-10 pb-14 lg:pt-12 lg:pb-20">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/our-work"
              className="inline-flex items-center gap-2 font-bold text-[#176B1C]"
            >
              <ArrowLeft
                size={18}
              />
              Back to Our Work
            </Link>

            {project.location && (
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                <MapPin
                  size={17}
                />

                {
                  project.location
                }
              </div>
            )}
          </div>

          {project.media?.length >
          0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {project.media.map(
                (
                  media,
                  index,
                ) => (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() =>
                      setSelectedMediaIndex(
                        index,
                      )
                    }
                    className={[
                      "group relative overflow-hidden rounded-3xl bg-slate-100",
                      index === 0
                        ? "md:col-span-2 lg:col-span-2"
                        : "",
                    ].join(" ")}
                  >
                    {media.media_type ===
                    "video" ? (
                      <>
                        <video
                          src={media.url}
                          muted
                          playsInline
                          preload="metadata"
                          className={[
                            "w-full object-cover transition duration-500 group-hover:scale-[1.02]",
                            index === 0
                              ? "aspect-[16/10]"
                              : "aspect-square",
                          ].join(
                            " ",
                          )}
                        />

                        <span className="absolute inset-0 grid place-items-center bg-black/20">
                          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-[#176B1C] shadow-lg">
                            <Play
                              size={23}
                              fill="currentColor"
                            />
                          </span>
                        </span>
                      </>
                    ) : (
                      <img
                        src={galleryImageUrl(
    media.url,
    {
      width:
        index === 0
          ? 1200
          : 900,
      quality: 80,
    },
  )}
                        alt={
                          media.alt_text ||
                          project.title
                        }
                        loading="lazy"
                        decoding="async"
                        className={[
                          "w-full object-cover transition duration-500 group-hover:scale-[1.02]",
                          index === 0
                            ? "aspect-[16/10]"
                            : "aspect-square",
                        ].join(
                          " ",
                        )}
                      />
                    )}
                  </button>
                ),
              )}
            </div>
          ) : (
            <div className="mt-8 grid min-h-72 place-items-center rounded-3xl bg-slate-100">
              <div className="text-center text-slate-400">
                <ImageOff
                  size={36}
                  className="mx-auto"
                />

                <p className="mt-3 font-semibold">
                  No project photos available.
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_.7fr]">
            <article>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#176B1C]">
                Completed project
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#153f36]">
                {project.title}
              </h2>

              {project.description && (
                <p className="mt-5 max-w-3xl leading-8 text-slate-600">
                  {
                    project.description
                  }
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-[#176B1C]">
                  {category}
                </span>

                {project.location && (
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    {
                      project.location
                    }
                  </span>
                )}
              </div>
            </article>

            <aside className="rounded-3xl bg-[#f5faf7] p-7">
              <h2 className="text-xl font-bold text-[#153f36]">
                Have a similar
                project?
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Tell us about the
                surface, its current
                condition and the result
                you&apos;re looking for.
                Photos can be included
                with your quote request.
              </p>

              <Link
                to="/request-a-quote"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#228B22] px-5 py-3 font-bold text-white transition hover:bg-[#176B1C]"
              >
                Request a quote
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {selectedMediaIndex !==
        null && (
        <Lightbox
          project={project}
          index={
            selectedMediaIndex
          }
          onClose={() =>
            setSelectedMediaIndex(
              null,
            )
          }
          onPrevious={
            previousMedia
          }
          onNext={nextMedia}
          onSelect={
            setSelectedMediaIndex
          }
        />
      )}
    </>
  );
}
