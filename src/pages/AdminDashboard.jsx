import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ClipboardList,
  ExternalLink,
  LogOut,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
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
  "grout-recolouring": "Grout Recolouring",
  biosteam: "BioSteam Deep Cleaning",
  "surface-restoration": "Tile & Surface Restoration",
  bathroom: "Bathroom & Shower Restoration",
  kitchen: "Kitchen Surface Care",
  floor: "Floor Cleaning & Maintenance",
  commercial: "Commercial Surface Cleaning",
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

function formatAppointment(value) {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "full",
      timeStyle: "short",
    },
  ).format(date);
}

function formatAppointmentShort(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function formatMoney(pence) {
  if (
    pence === null ||
    pence === undefined
  ) {
    return "Not set";
  }

  return new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency: "GBP",
    },
  ).format(pence / 100);
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

function getEnquiryRowClass(status) {
  if (status === "booked") {
    return "bg-emerald-50/50 hover:bg-emerald-50";
  }

  if (status === "quoted") {
    return "bg-violet-50/40 hover:bg-violet-50";
  }

  if (status === "new") {
    return "bg-blue-50/30 hover:bg-blue-50/70";
  }

  if (status === "completed") {
    return "bg-green-50/30 hover:bg-green-50/60";
  }

  if (status === "cancelled") {
    return "bg-red-50/20 hover:bg-red-50/50";
  }

  return "hover:bg-slate-50";
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

  const [photos, setPhotos] =
    useState([]);

  const [photosLoading, setPhotosLoading] =
    useState(false);

  const [statusSaving, setStatusSaving] =
    useState(false);

  const [deleteSaving, setDeleteSaving] =
    useState(false);

  const [notes, setNotes] =
    useState([]);

  const [notesLoading, setNotesLoading] =
    useState(false);

  const [notesError, setNotesError] =
    useState("");

  const [newNote, setNewNote] =
    useState("");

  const [noteSaving, setNoteSaving] =
    useState(false);

  const [quoteAmount, setQuoteAmount] =
    useState("");

  const [
    quoteAmountSaving,
    setQuoteAmountSaving,
  ] = useState(false);

  const [
    quoteAmountMessage,
    setQuoteAmountMessage,
  ] = useState("");

  const [
    appointmentAt,
    setAppointmentAt,
  ] = useState("");

  const [
    appointmentSaving,
    setAppointmentSaving,
  ] = useState(false);

  const [
    appointmentMessage,
    setAppointmentMessage,
  ] = useState("");

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

  async function loadPhotos(reference) {
    try {
      setPhotosLoading(true);
      setPhotos([]);

      const response = await fetch(
        `/api/admin/quotes/${encodeURIComponent(
          reference,
        )}/photos`,
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
          `Photo request failed with status ${response.status}`,
        );
      }

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to load photos.",
        );
      }

      setPhotos(data.photos || []);
    } catch (err) {
      console.error(err);

      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  }

  async function loadNotes(reference) {
    try {
      setNotesLoading(true);
      setNotesError("");
      setNotes([]);

      const response = await fetch(
        `/api/admin/quotes/${encodeURIComponent(
          reference,
        )}/notes`,
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
            "Unable to load notes.",
        );
      }

      setNotes(data.notes || []);
    } catch (err) {
      console.error(err);

      setNotesError(
        "We couldn't load the internal notes.",
      );

      setNotes([]);
    } finally {
      setNotesLoading(false);
    }
  }

  async function saveNote(reference) {
    const note = newNote.trim();

    if (!note || noteSaving) {
      return;
    }

    try {
      setNoteSaving(true);
      setNotesError("");

      const response = await fetch(
        `/api/admin/quotes/${encodeURIComponent(
          reference,
        )}/notes`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            note,
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
            "Unable to save note.",
        );
      }

      setNewNote("");

      await loadNotes(reference);
    } catch (err) {
      console.error(err);

      setNotesError(
        err.message ||
          "The note could not be saved.",
      );
    } finally {
      setNoteSaving(false);
    }
  }

  async function saveQuoteAmount(
    reference,
  ) {
    const rawAmount =
      quoteAmount.trim();

    const amount = Number(rawAmount);

    if (
      rawAmount === "" ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      setQuoteAmountMessage(
        "Please enter a valid amount.",
      );

      return;
    }

    try {
      setQuoteAmountSaving(true);
      setQuoteAmountMessage("");

      const response = await fetch(
        `/api/admin/quotes/${encodeURIComponent(
          reference,
        )}/quote-amount`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            amount,
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
            "Unable to save quote amount.",
        );
      }

      const amountPence =
        data.quoted_amount_pence;

      setQuotes((current) =>
        current.map((quote) =>
          quote.reference === reference
            ? {
                ...quote,
                quoted_amount_pence:
                  amountPence,
              }
            : quote,
        ),
      );

      setSelectedQuote((current) =>
        current?.reference === reference
          ? {
              ...current,
              quoted_amount_pence:
                amountPence,
            }
          : current,
      );

      setQuoteAmount(
        (
          amountPence / 100
        ).toFixed(2),
      );

      setQuoteAmountMessage(
        "Quote amount saved.",
      );
    } catch (err) {
      console.error(err);

      setQuoteAmountMessage(
        err.message ||
          "The quote amount could not be saved.",
      );
    } finally {
      setQuoteAmountSaving(false);
    }
  }

  async function saveAppointment(
    reference,
  ) {
    if (
      !appointmentAt ||
      appointmentSaving
    ) {
      setAppointmentMessage(
        "Please select a date and time.",
      );

      return;
    }

    try {
      setAppointmentSaving(true);
      setAppointmentMessage("");

      const response = await fetch(
        `/api/admin/quotes/${encodeURIComponent(
          reference,
        )}/appointment`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            appointment_at:
              appointmentAt,
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
            "Unable to save appointment.",
        );
      }

      const savedAppointment =
        data.appointment_at;

      setQuotes((current) =>
        current.map((quote) =>
          quote.reference === reference
            ? {
                ...quote,
                appointment_at:
                  savedAppointment,
              }
            : quote,
        ),
      );

      setSelectedQuote((current) =>
        current?.reference === reference
          ? {
              ...current,
              appointment_at:
                savedAppointment,
            }
          : current,
      );

      setAppointmentAt(
        savedAppointment,
      );

      setAppointmentMessage(
        "Appointment saved.",
      );
    } catch (err) {
      console.error(err);

      setAppointmentMessage(
        err.message ||
          "The appointment could not be saved.",
      );
    } finally {
      setAppointmentSaving(false);
    }
  }

  async function updateStatus(
    reference,
    status,
  ) {
    try {
      setStatusSaving(true);

      const response = await fetch(
        `/api/admin/quotes/${encodeURIComponent(
          reference,
        )}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status,
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
            "Unable to update status.",
        );
      }

      setQuotes((current) =>
        current.map((quote) =>
          quote.reference === reference
            ? {
                ...quote,
                status,
              }
            : quote,
        ),
      );

      setSelectedQuote((current) =>
        current?.reference === reference
          ? {
              ...current,
              status,
            }
          : current,
      );
    } catch (err) {
      console.error(err);

      window.alert(
        "The enquiry status could not be updated.",
      );
    } finally {
      setStatusSaving(false);
    }
  }

  async function deleteEnquiry(
    reference,
  ) {
    if (deleteSaving) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete enquiry ${reference}?\n\nThis permanently removes the enquiry, its internal notes and its private customer-uploaded quote photos. Linked gallery projects will remain.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteSaving(true);

      const response = await fetch(
        `/api/admin/quotes/${encodeURIComponent(
          reference,
        )}/delete`,
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
            "Unable to delete enquiry.",
        );
      }

      setQuotes((current) =>
        current.filter(
          (quote) =>
            quote.reference !==
            reference,
        ),
      );

      closeQuote();
    } catch (err) {
      console.error(err);

      window.alert(
        err.message ||
          "The enquiry could not be deleted.",
      );
    } finally {
      setDeleteSaving(false);
    }
  }

  function openQuote(quote) {
    setSelectedQuote(quote);

    setNewNote("");
    setNotes([]);
    setNotesError("");

    setQuoteAmountMessage("");
    setAppointmentMessage("");

    if (
      quote.quoted_amount_pence !==
        null &&
      quote.quoted_amount_pence !==
        undefined
    ) {
      setQuoteAmount(
        (
          quote.quoted_amount_pence /
          100
        ).toFixed(2),
      );
    } else {
      setQuoteAmount("");
    }

    setAppointmentAt(
      quote.appointment_at || "",
    );

    loadPhotos(quote.reference);
    loadNotes(quote.reference);
  }

  function closeQuote() {
    setSelectedQuote(null);

    setPhotos([]);
    setNotes([]);
    setNewNote("");
    setNotesError("");

    setQuoteAmount("");
    setQuoteAmountMessage("");

    setAppointmentAt("");
    setAppointmentMessage("");
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

  const bookedValuePence =
    quotes
      .filter(
        (quote) =>
          quote.status === "booked" &&
          quote.quoted_amount_pence !==
            null &&
          quote.quoted_amount_pence !==
            undefined,
      )
      .reduce(
        (sum, quote) =>
          sum +
          Number(
            quote.quoted_amount_pence,
          ),
        0,
      );

  const completedRevenuePence =
    quotes
      .filter(
        (quote) =>
          quote.status ===
            "completed" &&
          quote.quoted_amount_pence !==
            null &&
          quote.quoted_amount_pence !==
            undefined,
      )
      .reduce(
        (sum, quote) =>
          sum +
          Number(
            quote.quoted_amount_pence,
          ),
        0,
      );

  return {
    total,
    newCount,
    bookedValuePence,
    completedRevenuePence,
  };
  }, [quotes]);

  const upcomingJobsList = useMemo(() => {
    const now = new Date();

    return quotes
      .filter((quote) => {
        if (
          !quote.appointment_at ||
          quote.status === "cancelled" ||
          quote.status === "completed"
        ) {
          return false;
        }

        const appointment = new Date(
          quote.appointment_at,
        );

        return (
          !Number.isNaN(appointment.getTime()) &&
          appointment >= now
        );
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_at) -
          new Date(b.appointment_at),
      )
      .slice(0, 5);
  }, [quotes]);

  const completedJobsList = useMemo(() => {
    return quotes
      .filter(
        (quote) =>
          quote.status === "completed",
      )
      .sort((a, b) => {
        const aDate = new Date(
          a.appointment_at ||
            a.updated_at ||
            a.created_at,
        );

        const bDate = new Date(
          b.appointment_at ||
            b.updated_at ||
            b.created_at,
        );

        return bDate - aDate;
      })
      .slice(0, 5);
  }, [quotes]);

  if (selectedQuote) {
    const quote = selectedQuote;

    const mapsUrl =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        quote.postcode,
      )}`;

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

            <div className="flex items-center gap-4">
              <Link
                to="/admin/gallery"
                className="font-semibold text-[#176B1C]"
              >
                Gallery
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
          <button
            type="button"
            onClick={closeQuote}
            className="inline-flex items-center gap-2 font-bold text-[#176B1C]"
          >
            <ArrowLeft size={18} />
            Back to enquiries
          </button>

          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
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

                    <select
                      value={quote.status}
                      disabled={statusSaving}
                      onChange={(event) =>
                        updateStatus(
                          quote.reference,
                          event.target.value,
                        )
                      }
                      className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#176B1C] focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
                    >
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
                  </div>

                  <p className="mt-2 text-slate-500">
                    Submitted{" "}
                    {formatDate(
                      quote.created_at,
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-[#176B1C]">
                    {quote.photo_count}{" "}
                    photo
                    {quote.photo_count === 1
                      ? ""
                      : "s"}
                  </div>

                  <button
                    type="button"
                    disabled={deleteSaving}
                    onClick={() =>
                      deleteEnquiry(
                        quote.reference,
                      )
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleteSaving ? (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={17} />
                    )}

                    {deleteSaving
                      ? "Deleting..."
                      : "Delete enquiry"}
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="border-b border-slate-200 bg-slate-50/70 p-5 md:px-8">
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${quote.phone}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#176B1C] px-5 font-bold text-white transition hover:bg-[#0f5515]"
                >
                  <Phone size={17} />
                  Call customer
                </a>

                <a
                  href={`mailto:${quote.email}?subject=${encodeURIComponent(
                    `EcoSurfaceCare enquiry ${quote.reference}`,
                  )}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <Mail size={17} />
                  Email customer
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <MapPin size={17} />
                  Open Maps
                  <ExternalLink
                    size={14}
                  />
                </a>
              </div>
            </div>

            {/* CUSTOMER + JOB */}
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

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#176B1C]"
                      >
                        {quote.postcode}
                      </a>
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

            {/* QUOTED AMOUNT */}
            <div className="border-t border-slate-200 p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                    Commercial details
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    Quoted amount
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Store the amount quoted to this
                    customer. This is private and is
                    not shown on the public website.
                  </p>

                  <div className="mt-5 rounded-2xl bg-emerald-50 p-5">
                    <p className="text-sm font-semibold text-slate-600">
                      Current quote
                    </p>

                    <p className="mt-1 text-3xl font-bold text-[#176B1C]">
                      {formatMoney(
                        quote.quoted_amount_pence,
                      )}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();

                    saveQuoteAmount(
                      quote.reference,
                    );
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <label
                    htmlFor="quote-amount"
                    className="block text-sm font-bold text-slate-700"
                  >
                    Quote amount
                  </label>

                  <div className="mt-2 flex">
                    <span className="grid min-h-12 place-items-center rounded-l-xl border border-r-0 border-slate-300 bg-white px-4 font-bold text-slate-600">
                      £
                    </span>

                    <input
                      id="quote-amount"
                      type="number"
                      min="0"
                      max="1000000"
                      step="0.01"
                      inputMode="decimal"
                      value={quoteAmount}
                      onChange={(event) => {
                        setQuoteAmount(
                          event.target.value,
                        );

                        setQuoteAmountMessage(
                          "",
                        );
                      }}
                      placeholder="240.00"
                      className="min-h-12 min-w-0 flex-1 rounded-r-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-[#176B1C] focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      quoteAmountSaving ||
                      !quoteAmount.trim()
                    }
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#176B1C] px-5 font-bold text-white transition hover:bg-[#0f5515] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {quoteAmountSaving && (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {quoteAmountSaving
                      ? "Saving..."
                      : "Save amount"}
                  </button>

                  {quoteAmountMessage && (
                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      {
                        quoteAmountMessage
                      }
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* APPOINTMENT */}
            <div className="border-t border-slate-200 p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div>
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                      <CalendarClock
                        size={21}
                      />
                    </span>

                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                        Scheduling
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        Appointment / job
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    Save the agreed visit or job date
                    and time for this enquiry.
                  </p>

                  <div className="mt-5 rounded-2xl bg-amber-50 p-5">
                    <p className="text-sm font-semibold text-slate-600">
                      Current appointment
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {formatAppointment(
                        quote.appointment_at,
                      )}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();

                    saveAppointment(
                      quote.reference,
                    );
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <label
                    htmlFor="appointment-at"
                    className="block text-sm font-bold text-slate-700"
                  >
                    Date and time
                  </label>

                  <input
                    id="appointment-at"
                    type="datetime-local"
                    value={appointmentAt}
                    onChange={(event) => {
                      setAppointmentAt(
                        event.target.value,
                      );

                      setAppointmentMessage(
                        "",
                      );
                    }}
                    className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-[#176B1C] focus:ring-4 focus:ring-emerald-100"
                  />

                  <button
                    type="submit"
                    disabled={
                      appointmentSaving ||
                      !appointmentAt
                    }
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#176B1C] px-5 font-bold text-white transition hover:bg-[#0f5515] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {appointmentSaving && (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {appointmentSaving
                      ? "Saving..."
                      : "Save appointment"}
                  </button>

                  {appointmentMessage && (
                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      {
                        appointmentMessage
                      }
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* CUSTOMER PHOTOS */}
            <div className="border-t border-slate-200 p-6 md:p-8">
              <div>
                <h3 className="text-lg font-bold">
                  Customer photos
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Photos supplied with this quote request.
                </p>
              </div>

              {photosLoading ? (
                <div className="mt-6 flex items-center gap-3 text-slate-500">
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />

                  Loading photos...
                </div>
              ) : photos.length === 0 ? (
                <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                  No photographs were supplied with this enquiry.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map(
                    (photo, index) => (
                      <a
                        key={photo.key}
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={photo.url}
                          alt={`Quote ${quote.reference} photo ${
                            index + 1
                          }`}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />

                        <div className="p-3">
                          <p className="text-sm font-semibold text-slate-700">
                            Photo{" "}
                            {index + 1}
                          </p>
                        </div>
                      </a>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* INTERNAL NOTES */}
            <div className="border-t border-slate-200 p-6 md:p-8">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-[#176B1C]">
                  <MessageSquareText
                    size={21}
                  />
                </span>

                <div>
                  <h3 className="text-lg font-bold">
                    Internal notes
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Private notes for this enquiry.
                    Customers cannot see these.
                  </p>
                </div>
              </div>

              <form
                className="mt-6"
                onSubmit={(event) => {
                  event.preventDefault();

                  saveNote(
                    quote.reference,
                  );
                }}
              >
                <label
                  htmlFor="internal-note"
                  className="text-sm font-bold text-slate-700"
                >
                  Add a note
                </label>

                <textarea
                  id="internal-note"
                  rows={4}
                  maxLength={5000}
                  value={newNote}
                  onChange={(event) =>
                    setNewNote(
                      event.target.value,
                    )
                  }
                  placeholder="For example: Called customer, discussed grout recolouring and waiting for preferred appointment date."
                  className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#176B1C] focus:ring-4 focus:ring-emerald-100"
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    {newNote.length.toLocaleString(
                      "en-GB",
                    )}
                    /5,000 characters
                  </p>

                  <button
                    type="submit"
                    disabled={
                      noteSaving ||
                      !newNote.trim()
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#176B1C] px-5 font-bold text-white transition hover:bg-[#0f5515] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {noteSaving ? (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Plus size={18} />
                    )}

                    {noteSaving
                      ? "Saving..."
                      : "Add note"}
                  </button>
                </div>
              </form>

              {notesError && (
                <div
                  role="alert"
                  className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
                >
                  {notesError}
                </div>
              )}

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-bold text-slate-900">
                    Activity
                  </h4>

                  {notes.length > 0 && (
                    <span className="text-sm text-slate-500">
                      {notes.length}{" "}
                      {notes.length === 1
                        ? "note"
                        : "notes"}
                    </span>
                  )}
                </div>

                {notesLoading ? (
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-5 text-slate-500">
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />

                    Loading notes...
                  </div>
                ) : notes.length === 0 ? (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-6">
                    <p className="font-semibold text-slate-700">
                      No internal notes yet.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Add the first note above when you contact the customer or update the enquiry.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4">
                    {notes.map(
                      (note) => (
                        <article
                          key={note.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                        >
                          <p className="whitespace-pre-wrap leading-7 text-slate-700">
                            {
                              note.note
                            }
                          </p>

                          <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                              {note.author_email ||
                                "EcoSurfaceCare owner"}
                            </span>

                            <time>
                              {formatDate(
                                note.created_at,
                              )}
                            </time>
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                )}
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

          <div className="flex items-center gap-4">
            <Link
              to="/admin/gallery"
              className="font-semibold text-[#176B1C]"
            >
              Gallery
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
        {/* DASHBOARD METRICS */}
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
            <Banknote className="text-emerald-600" />

            <p className="mt-5 text-3xl font-bold">
              {formatMoney(
                stats.bookedValuePence,
              )}
            </p>

            <p className="mt-1 text-slate-500">
              Booked value
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <CheckCircle2 className="text-green-600" />

            <p className="mt-5 text-3xl font-bold">
              {formatMoney(
                stats.completedRevenuePence,
              )}
            </p>

            <p className="mt-1 text-slate-500">
              Completed revenue
            </p>
          </article>
        </div>

        {/* UPCOMING JOBS */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                <CalendarClock size={21} />
              </span>

              <div>
                <h2 className="text-2xl font-bold">
                  Upcoming jobs
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your next scheduled visits and jobs.
                </p>
              </div>
            </div>

            {upcomingJobsList.length > 0 && (
              <span className="self-start rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 sm:self-auto">
                {upcomingJobsList.length} shown
              </span>
            )}
          </div>

          {upcomingJobsList.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarClock
                size={34}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No upcoming jobs
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Future appointments will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {upcomingJobsList.map((quote) => (
                <button
                  key={quote.id}
                  type="button"
                  onClick={() => openQuote(quote)}
                  className="grid w-full gap-4 p-5 text-left transition hover:bg-amber-50/50 md:grid-cols-[1.15fr_.95fr_.85fr_.8fr_auto] md:items-center md:px-6"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {quote.name}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={quote.status} />
                      <span className="text-xs font-semibold text-[#176B1C]">
                        {quote.reference}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {serviceLabels[quote.service] ||
                        friendlyValue(quote.service)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {quote.postcode}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Appointment
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {formatAppointmentShort(
                        quote.appointment_at,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Quote
                    </p>
                    <p className="mt-1 font-bold text-[#176B1C]">
                      {formatMoney(
                        quote.quoted_amount_pence,
                      )}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm font-bold text-[#176B1C]">
                      Open job →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* COMPLETED JOBS */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={21} />
              </span>

              <div>
                <h2 className="text-2xl font-bold">
                  Completed jobs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Recently completed work and recorded revenue.
                </p>
              </div>
            </div>

            {completedJobsList.length > 0 && (
              <span className="self-start rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 sm:self-auto">
                {completedJobsList.length} shown
              </span>
            )}
          </div>

          {completedJobsList.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2
                size={34}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No completed jobs yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Jobs will appear here when their status is changed to Completed.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {completedJobsList.map((quote) => (
                <button
                  key={quote.id}
                  type="button"
                  onClick={() => openQuote(quote)}
                  className="grid w-full gap-4 p-5 text-left transition hover:bg-emerald-50/50 md:grid-cols-[1.15fr_.95fr_.85fr_.8fr_auto] md:items-center md:px-6"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {quote.name}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={quote.status} />
                      <span className="text-xs font-semibold text-[#176B1C]">
                        {quote.reference}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {serviceLabels[quote.service] ||
                        friendlyValue(quote.service)}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {quote.postcode}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Job date
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {quote.appointment_at
                        ? formatAppointmentShort(
                            quote.appointment_at,
                          )
                        : "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Revenue
                    </p>

                    <p className="mt-1 font-bold text-emerald-700">
                      {formatMoney(
                        quote.quoted_amount_pence,
                      )}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm font-bold text-[#176B1C]">
                      View job →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ENQUIRIES */}
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

          {loading &&
          quotes.length === 0 ? (
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
          ) : filteredQuotes.length ===
            0 ? (
            <div className="p-10 text-center">
              <ClipboardList
                className="mx-auto text-slate-300"
                size={36}
              />

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
                      openQuote(quote)
                    }
                    className={[
                      "grid w-full gap-4 p-5 text-left transition",
                      "md:grid-cols-[1.25fr_.9fr_.85fr_.85fr_auto] md:items-center md:px-6",
                      getEnquiryRowClass(
                        quote.status,
                      ),
                    ].join(" ")}
                  >
                    {/* CUSTOMER */}
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

                    {/* SERVICE */}
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
                        {
                          quote.postcode
                        }
                      </p>
                    </div>

                    {/* MONEY */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Quote
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {formatMoney(
                          quote.quoted_amount_pence,
                        )}
                      </p>
                    </div>

                    {/* APPOINTMENT */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Appointment
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatAppointmentShort(
                          quote.appointment_at,
                        ) ||
                          "Not scheduled"}
                      </p>
                    </div>

                    {/* VIEW */}
                    <div className="md:text-right">
                      <p className="text-xs text-slate-500">
                        {
                          quote.photo_count
                        }{" "}
                        photo
                        {quote.photo_count ===
                        1
                          ? ""
                          : "s"}
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
