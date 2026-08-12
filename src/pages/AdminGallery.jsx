import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  ImagePlus,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    value: "grout-cleaning",
    label: "Grout Cleaning",
  },
  {
    value: "grout-recolouring",
    label: "Grout Recolouring",
  },
  {
    value: "biosteam",
    label: "BioSteam Deep Cleaning",
  },
  {
    value: "surface-restoration",
    label: "Tile & Surface Restoration",
  },
  {
    value: "bathroom",
    label: "Bathroom & Shower Restoration",
  },
  {
    value: "kitchen",
    label: "Kitchen Surface Care",
  },
  {
    value: "floor",
    label: "Floor Cleaning & Maintenance",
  },
  {
    value: "commercial",
    label: "Commercial Surface Cleaning",
  },
];

function StatusBadge({ status }) {
  const published =
    status === "published";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-bold",
        published
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600",
      ].join(" ")}
    >
      {published
        ? "Published"
        : "Draft"}
    </span>
  );
}

export default function AdminGallery() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selected, setSelected] =
    useState(null);

  const [creating, setCreating] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    deletingProject,
    setDeletingProject,
  ] = useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      category:
        "grout-recolouring",
      location: "",
      description: "",
    });

  const [mediaFile, setMediaFile] =
    useState(null);

  const [altText, setAltText] =
    useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/gallery",
        {
          method: "GET",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
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
            "Unable to load gallery.",
        );
      }

      setProjects(
        data.projects || [],
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load gallery projects.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadProject(id) {
    try {
      setMessage("");

      const response = await fetch(
        `/api/admin/gallery/${id}`,
        {
          method: "GET",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
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

      setSelected(data.project);

      setForm({
        title:
          data.project.title || "",
        category:
          data.project.category ||
          "grout-recolouring",
        location:
          data.project.location || "",
        description:
          data.project.description ||
          "",
      });
    } catch (err) {
      console.error(err);

      setMessage(
        err.message ||
          "Unable to load project.",
      );
    }
  }

  async function createProject(
    event,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        "/api/admin/gallery",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            category:
              form.category,
            location:
              form.location,
            description:
              form.description,
          }),
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
            "Unable to create project.",
        );
      }

      setCreating(false);

      await loadProjects();

      await loadProject(
        data.project.id,
      );

      setMessage(
        "Gallery project created.",
      );
    } catch (err) {
      console.error(err);

      setMessage(
        err.message ||
          "Unable to create gallery project.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveProject() {
    if (!selected) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `/api/admin/gallery/${selected.id}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            category:
              form.category,
            location:
              form.location,
            description:
              form.description,
          }),
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
            "Unable to save project.",
        );
      }

      setSelected((current) => ({
        ...current,
        ...data.project,
      }));

      await loadProjects();

      setMessage(
        "Project saved.",
      );
    } catch (err) {
      console.error(err);

      setMessage(
        err.message ||
          "Unable to save project.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    if (!selected) {
      return;
    }

    const nextStatus =
      selected.status ===
      "published"
        ? "draft"
        : "published";

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `/api/admin/gallery/${selected.id}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status:
              nextStatus,
          }),
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
            "Unable to update project.",
        );
      }

      setSelected((current) => ({
        ...current,
        ...data.project,
      }));

      await loadProjects();

      setMessage(
        nextStatus ===
          "published"
          ? "Project published."
          : "Project returned to draft.",
      );
    } catch (err) {
      console.error(err);

      setMessage(
        err.message ||
          "Unable to update project.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject() {
    if (
      !selected ||
      deletingProject
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete gallery project "${selected.title}"?\n\nThis permanently removes the project and all of its gallery images/videos from storage. This cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProject(true);
      setMessage("");

      const response = await fetch(
        `/api/admin/gallery/${selected.id}/delete`,
        {
          method: "DELETE",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
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
            "Unable to delete gallery project.",
        );
      }

      setSelected(null);

      await loadProjects();

      window.alert(
        "Gallery project deleted.",
      );
    } catch (err) {
      console.error(err);

      setMessage(
        err.message ||
          "Unable to delete gallery project.",
      );
    } finally {
      setDeletingProject(false);
    }
  }

  async function uploadMedia(
    event,
  ) {
    event.preventDefault();

    if (
      !selected ||
      !mediaFile
    ) {
      setMessage(
        "Please select a file first.",
      );
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData =
        new FormData();

      formData.append(
        "file",
        mediaFile,
      );

      formData.append(
        "altText",
        altText,
      );

      const response = await fetch(
        `/api/admin/gallery/${selected.id}/media`,
        {
          method: "POST",
          credentials: "same-origin",
          body: formData,
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
            "Unable to upload media.",
        );
      }

      setMediaFile(null);
      setAltText("");

      await loadProject(
        selected.id,
      );

      await loadProjects();

      setMessage(
        "Media uploaded.",
      );
    } catch (err) {
      console.error(err);

      setMessage(
        err.message ||
          "Unable to upload media.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteMedia(
    mediaId,
  ) {
    if (!selected) {
      return;
    }

    const confirmed =
      window.confirm(
        "Remove this media item?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      const response = await fetch(
        `/api/admin/gallery/${selected.id}/media/${mediaId}`,
        {
          method: "DELETE",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
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
            "Unable to delete media.",
        );
      }

      await loadProject(
        selected.id,
      );

      await loadProjects();

      setMessage(
        "Media removed.",
      );
    } catch (err) {
      console.error(err);

      setMessage(
        err.message ||
          "Unable to delete media.",
      );
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  if (selected) {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="container-site flex min-h-20 items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                EcoSurfaceCare
              </p>

              <h1 className="text-xl font-bold">
                Gallery project
              </h1>
            </div>

            <a
              href="/cdn-cgi/access/logout"
              className="inline-flex items-center gap-2 font-semibold text-[#176B1C]"
            >
              <LogOut size={18} />
              Sign out
            </a>
          </div>
        </header>

        <main className="container-site py-8 md:py-10">
          <button
            type="button"
            onClick={() =>
              setSelected(null)
            }
            className="inline-flex items-center gap-2 font-bold text-[#176B1C]"
          >
            <ArrowLeft size={18} />
            Back to gallery
          </button>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {selected.title}
                  </h2>

                  <StatusBadge
                    status={
                      selected.status
                    }
                  />
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  /{selected.slug}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    saving ||
                    deletingProject
                  }
                  onClick={
                    togglePublish
                  }
                  className="rounded-full bg-[#176B1C] px-5 py-3 font-bold text-white disabled:opacity-50"
                >
                  {selected.status ===
                  "published"
                    ? "Unpublish"
                    : "Publish"}
                </button>

                <button
                  type="button"
                  disabled={
                    deletingProject ||
                    saving
                  }
                  onClick={
                    deleteProject
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingProject ? (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={17} />
                  )}

                  {deletingProject
                    ? "Deleting..."
                    : "Delete project"}
                </button>
              </div>
            </div>

            {message && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {message}
              </div>
            )}

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold">
                  Project details
                </h3>

                <div className="mt-5 grid gap-4">
                  <label>
                    <span className="text-sm font-bold">
                      Title
                    </span>

                    <input
                      value={form.title}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          title:
                            event.target
                              .value,
                        })
                      }
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-bold">
                      Category
                    </span>

                    <select
                      value={
                        form.category
                      }
                      onChange={(event) =>
                        setForm({
                          ...form,
                          category:
                            event.target
                              .value,
                        })
                      }
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4"
                    >
                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category.value
                            }
                            value={
                              category.value
                            }
                          >
                            {
                              category.label
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label>
                    <span className="text-sm font-bold">
                      Location
                    </span>

                    <input
                      value={
                        form.location
                      }
                      onChange={(event) =>
                        setForm({
                          ...form,
                          location:
                            event.target
                              .value,
                        })
                      }
                      placeholder="Burnley"
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-bold">
                      Description
                    </span>

                    <textarea
                      rows={5}
                      value={
                        form.description
                      }
                      onChange={(event) =>
                        setForm({
                          ...form,
                          description:
                            event.target
                              .value,
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={
                      saveProject
                    }
                    disabled={saving}
                    className="justify-self-start rounded-full bg-[#176B1C] px-5 py-3 font-bold text-white disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Save project"}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold">
                  Add media
                </h3>

                <form
                  onSubmit={
                    uploadMedia
                  }
                  className="mt-5 rounded-2xl bg-slate-50 p-5"
                >
                  <label className="block">
                    <span className="text-sm font-bold">
                      Image or video
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/webm"
                      onChange={(event) =>
                        setMediaFile(
                          event.target
                            .files?.[0] ||
                            null,
                        )
                      }
                      className="mt-2 block w-full text-sm"
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-sm font-bold">
                      Alt text
                    </span>

                    <input
                      value={altText}
                      onChange={(event) =>
                        setAltText(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Restored bathroom grout in Burnley"
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={
                      uploading ||
                      !mediaFile
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#176B1C] px-5 py-3 font-bold text-white disabled:opacity-50"
                  >
                    {uploading ? (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Upload size={17} />
                    )}

                    {uploading
                      ? "Uploading..."
                      : "Upload media"}
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <h3 className="text-lg font-bold">
                Project media
              </h3>

              {!selected.media ||
              selected.media.length ===
                0 ? (
                <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                  No media uploaded yet.
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selected.media.map(
                    (media) => (
                      <article
                        key={media.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        {media.media_type === "video" ? (
                          <video
                            src={`/api/admin/gallery/${selected.id}/media/${media.id}/file`}
                            controls
                            preload="metadata"
                            className="aspect-[4/3] w-full rounded-xl bg-slate-100 object-cover"
                          >
                            Your browser does not support video playback.
                          </video>
                        ) : (
                          <img
                            src={`/api/admin/gallery/${selected.id}/media/${media.id}/file`}
                            alt={
                              media.alt_text ||
                              media.filename ||
                              "Gallery image"
                            }
                            loading="lazy"
                            decoding="async"
                            className="aspect-[4/3] w-full rounded-xl bg-slate-100 object-cover"
                          />
                        )}

                        <p className="mt-3 truncate text-sm font-semibold">
                          {media.filename}
                        </p>

                        {media.alt_text && (
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              media.alt_text
                            }
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteMedia(
                              media.id,
                            )
                          }
                          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-red-600"
                        >
                          <Trash2
                            size={16}
                          />
                          Remove
                        </button>
                      </article>
                    ),
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-site flex min-h-20 items-center justify-between gap-4 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              EcoSurfaceCare
            </p>

            <h1 className="text-xl font-bold">
              Gallery management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="font-semibold text-[#176B1C]"
            >
              Enquiries
            </Link>

            <a
              href="/cdn-cgi/access/logout"
              className="inline-flex items-center gap-2 font-semibold text-[#176B1C]"
            >
              <LogOut size={18} />
              Sign out
            </a>
          </div>
        </div>
      </header>

      <main className="container-site py-8 md:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Gallery projects
            </h2>

            <p className="mt-1 text-slate-500">
              Create, upload and publish completed work.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadProjects}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 font-bold"
            >
              <RefreshCw
                size={17}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setCreating(true);

                setForm({
                  title: "",
                  category:
                    "grout-recolouring",
                  location: "",
                  description: "",
                });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#176B1C] px-5 py-3 font-bold text-white"
            >
              <Plus size={18} />
              New project
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 font-semibold text-red-700">
            {error}
          </div>
        )}

        {creating && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold">
              Create gallery project
            </h3>

            <form
              onSubmit={
                createProject
              }
              className="mt-6 grid gap-4"
            >
              <input
                required
                value={form.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    title:
                      event.target
                        .value,
                  })
                }
                placeholder="Project title"
                className="min-h-12 rounded-xl border border-slate-300 px-4"
              />

              <select
                value={
                  form.category
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    category:
                      event.target
                        .value,
                  })
                }
                className="min-h-12 rounded-xl border border-slate-300 bg-white px-4"
              >
                {categories.map(
                  (category) => (
                    <option
                      key={
                        category.value
                      }
                      value={
                        category.value
                      }
                    >
                      {
                        category.label
                      }
                    </option>
                  ),
                )}
              </select>

              <input
                value={
                  form.location
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    location:
                      event.target
                        .value,
                  })
                }
                placeholder="Location"
                className="min-h-12 rounded-xl border border-slate-300 px-4"
              />

              <textarea
                rows={4}
                value={
                  form.description
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    description:
                      event.target
                        .value,
                  })
                }
                placeholder="Short project description"
                className="rounded-xl border border-slate-300 px-4 py-3"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#176B1C] px-5 py-3 font-bold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create project"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCreating(false)
                  }
                  className="rounded-full border border-slate-300 px-5 py-3 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="grid min-h-56 place-items-center">
              <RefreshCw className="animate-spin text-[#176B1C]" />
            </div>
          ) : projects.length ===
            0 ? (
            <div className="p-10 text-center">
              <ImagePlus
                size={36}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-bold">
                No gallery projects yet
              </h3>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {projects.map(
                (project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() =>
                      loadProject(
                        project.id,
                      )
                    }
                    className="grid w-full gap-4 p-5 text-left transition hover:bg-slate-50 md:grid-cols-[1.3fr_.9fr_.7fr_auto] md:items-center md:px-6"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-900">
                          {
                            project.title
                          }
                        </p>

                        <StatusBadge
                          status={
                            project.status
                          }
                        />
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        /
                        {
                          project.slug
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {
                          project.category
                        }
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {project.location ||
                          "No location"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {
                          project.media_count
                        }{" "}
                        media
                      </p>
                    </div>

                    <div className="flex items-center gap-2 font-bold text-[#176B1C]">
                      <Pencil
                        size={17}
                      />
                      Manage
                    </div>
                  </button>
                ),
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
