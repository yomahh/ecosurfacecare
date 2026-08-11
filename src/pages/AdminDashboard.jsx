import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ClipboardList,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

const statusStyles = {
  new: {
    label: "New",
    className:
      "border-blue-200 bg-blue-50 text-blue-700",
  },

  contacted: {
    label: "Contacted",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
  },

  quoted: {
    label: "Quoted",
    className:
      "border-violet-200 bg-violet-50 text-violet-700",
  },

  booked: {
    label: "Booked",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  completed: {
    label: "Completed",
    className:
      "border-green-200 bg-green-50 text-green-700",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "border-red-200 bg-red-50 text-red-700",
  },
};

const serviceLabels = {
  "grout-cleaning": "Grout Cleaning",
  "grout-recolouring":
    "Grout Recolouring",
  "tile-cleaning": "Tile Cleaning",
  "surface-cleaning":
    "Surface Cleaning",
  "steam-cleaning":
    "Steam Cleaning",
  commercial: "Commercial",
};

function friendlyValue(value = "") {
  return String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(
    `${value.replace(" ", "T")}Z`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function StatusBadge({ status }) {
  const config =
    statusStyles[status] ||
    statusStyles.new;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}

export default function AdminDashboard() {
  const [quotes, setQuotes] =
    useState([]);

  const [ownerEmail, setOwnerEmail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedQuote, setSelectedQuote] =
    useState(null);

  async function loadQuotes() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/quotes",
        {
          method: "GET",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`,
        );
      }

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to load enquiries.",
        );
      }

      setQuotes(data.quotes || []);

      setOwnerEmail(
        data.user?.email || "",
      );
    } catch (err) {
      console.error(err);

      setError(
        "We couldn't load the enquiries. Please refresh the page and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  const filteredQuotes = useMemo(
    () => {
      const term =
        search.trim().toLowerCase();

      return quotes.filter((quote) => {
        const matchesStatus =
          statusFilter === "all" ||
          quote.status === statusFilter;

        if (!matchesStatus) {
          return false;
        }

        if (!term) {
          return true;
        }

        const searchable = [
          quote.reference,
          quote.name,
          quote.email,
          quote.phone,
          quote.postcode,
          quote.service,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(term);
      });
    },
    [
      quotes,
      search,
      statusFilter,
    ],
  );

  const stats = useMemo(() => {
    const total = quotes.length;

    const newCount =
      quotes.filter(
        (quote) =>
          quote.status === "new",
      ).length;

    const activeCount =
      quotes.filter((quote) =>
        [
          "contacted",
          "quoted",
          "booked",
        ].includes(quote.status),
      ).length;

    const completedCount =
      quotes.filter(
        (quote) =>
          quote.status ===
          "completed",
      ).length;

    return {
      total,
      newCount,
      activeCount,
      completedCount,
    };
  }, [quotes]);

  if (selectedQuote) {
    const quote = selectedQuote;

    return (
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="container-site flex min-h-20 items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                EcoSurfaceCare
              </p>

              <h1 className="text-xl font-bold text-slate-900">
                Enquiry details
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
              setSelectedQuote(null)
            }
            className="inline-flex items-center gap-2 font-bold text-[#176B1C]"
          >
            <ArrowLeft size={18} />
            Back to enquiries
          </button>

          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {quote.reference}
                    </h2>

                    <StatusBadge
                      status={
                        quote.status
                      }
                    />
                  </div>

                  <p className="mt-2 text-slate-500">
                    Submitted{" "}
                    {formatDate(
                      quote.created_at,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-[#176B1C]">
                  {quote.photo_count}{" "}
                  photo
                  {quote.photo_count === 1
                    ? ""
                    : "s"}
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h3 className="text-lg font-bold">
                  Customer
                </h3>

                <div className="mt-5 grid gap-4">
                  <div className="flex gap-3">
                    <UserRound
                      className="mt-0.5 shrink-0 text-[#176B1C]"
                      size={20}
                    />

                    <div>
                      <p className="text-sm text-slate-500">
                        Name
                      </p>

                      <p className="font-semibold">
                        {quote.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail
                      className="mt-0.5 shrink-0 text-[#176B1C]"
                      size={20}
                    />

                    <div className="min-w-0">
                      <p className="text-sm text-slate-500">
                        Email
                      </p>

                      <a
                        href={`mailto:${quote.email}`}
                        className="break-all font-semibold text-[#176B1C]"
                      >
                        {quote.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone
                      className="mt-0.5 shrink-0 text-[#176B1C]"
                      size={20}
                    />

                    <div>
                      <p className="text-sm text-slate-500">
                        Phone
                      </p>

                      <a
                        href={`tel:${quote.phone}`}
                        className="font-semibold text-[#176B1C]"
                      >
                        {quote.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin
                      className="mt-0.5 shrink-0 text-[#176B1C]"
                      size={20}
                    />

                    <div>
                      <p className="text-sm text-slate-500">
                        Postcode
                      </p>

                      <p className="font-semibold">
                        {quote.postcode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold">
                  Job details
                </h3>

                <dl className="mt-5 grid gap-5">
                  <div>
                    <dt className="text-sm text-slate-500">
                      Property type
                    </dt>

                    <dd className="mt-1 font-semibold">
                      {friendlyValue(
                        quote.property_type,
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-slate-500">
                      Service
                    </dt>

                    <dd className="mt-1 font-semibold">
                      {serviceLabels[
                        quote.service
                      ] ||
                        friendlyValue(
                          quote.service,
                        )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-slate-500">
                      Description
                    </dt>

                    <dd className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">
                      {
                        quote.description
                      }
                    </dd>
                  </div>
                </dl>
              </div>
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

            <h1 className="text-xl font-bold text-slate-900">
              Owner dashboard
            </h1>

            {ownerEmail && (
              <p className="mt-1 text-xs text-slate-500">
                Signed in as{" "}
                {ownerEmail}
              </p>
            )}
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
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <ClipboardList className="text-[#176B1C]" />

            <p className="mt-5 text-3xl font-bold">
              {stats.total}
            </p>

            <p className="mt-1 text-slate-500">
              Total enquiries
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <CircleDot className="text-blue-600" />

            <p className="mt-5 text-3xl font-bold">
              {stats.newCount}
            </p>

            <p className="mt-1 text-slate-500">
              New enquiries
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <CalendarDays className="text-amber-600" />

            <p className="mt-5 text-3xl font-bold">
              {stats.activeCount}
            </p>

            <p className="mt-1 text-slate-500">
              In progress
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <CheckCircle2 className="text-emerald-600" />

            <p className="mt-5 text-3xl font-bold">
              {stats.completedCount}
            </p>

            <p className="mt-1 text-slate-500">
              Completed
            </p>
          </article>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Quote enquiries
                </h2>

                <p className="mt-1 text-slate-500">
                  Customer requests submitted through
                  ecosurfacecare.co.uk.
                </p>
              </div>

              <button
                type="button"
                onClick={loadQuotes}
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-slate-300 bg-white px-5 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px]">
              <label className="relative">
                <span className="sr-only">
                  Search enquiries
                </span>

                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search reference, customer, postcode..."
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 outline-none transition focus:border-[#176B1C] focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="relative">
                <span className="sr-only">
                  Filter by status
                </span>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value,
                    )
                  }
                  className="min-h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-10 font-semibold outline-none transition focus:border-[#176B1C] focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="all">
                    All statuses
                  </option>

                  <option value="new">
                    New
                  </option>

                  <option value="contacted">
                    Contacted
                  </option>

                  <option value="quoted">
                    Quoted
                  </option>

                  <option value="booked">
                    Booked
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </label>
            </div>
          </div>

          {loading && quotes.length === 0 ? (
            <div className="grid min-h-64 place-items-center p-8">
              <div className="text-center">
                <RefreshCw className="mx-auto animate-spin text-[#176B1C]" />

                <p className="mt-4 font-semibold text-slate-600">
                  Loading enquiries...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={loadQuotes}
                className="mt-5 rounded-full bg-[#176B1C] px-5 py-3 font-bold text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="p-10 text-center">
              <ClipboardList className="mx-auto text-slate-300" size={36} />

              <h3 className="mt-4 text-lg font-bold">
                No enquiries found
              </h3>

              <p className="mt-2 text-slate-500">
                New quote requests will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredQuotes.map(
                (quote) => (
                  <button
                    key={quote.id}
                    type="button"
                    onClick={() =>
                      setSelectedQuote(
                        quote,
                      )
                    }
                    className="grid w-full gap-4 p-5 text-left transition hover:bg-slate-50 md:grid-cols-[1.25fr_.9fr_.8fr_auto] md:items-center md:px-6"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-900">
                          {quote.name}
                        </p>

                        <StatusBadge
                          status={
                            quote.status
                          }
                        />
                      </div>

                      <p className="mt-1 text-sm font-semibold text-[#176B1C]">
                        {
                          quote.reference
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {serviceLabels[
                          quote.service
                        ] ||
                          friendlyValue(
                            quote.service,
                          )}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {friendlyValue(
                          quote.property_type,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-700">
                        {
                          quote.postcode
                        }
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {
                          quote.photo_count
                        }{" "}
                        photo
                        {quote.photo_count ===
                        1
                          ? ""
                          : "s"}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-slate-500">
                        {formatDate(
                          quote.created_at,
                        )}
                      </p>

                      <p className="mt-2 text-sm font-bold text-[#176B1C]">
                        View enquiry →
                      </p>
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
