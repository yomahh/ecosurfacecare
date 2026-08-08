import { MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PHONE_NUMBER = "447873945808";

const whatsappMessage = encodeURIComponent(
  `Hi EcoSurfaceCare,

I'd like a free quote.

Service required:
Property type:
Location:

I've attached some photos.

Thank you.`,
);

export default function FloatingContactButtons() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const hiddenRoutes = ["/request-a-quote"];

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 400;
      setVisible(shouldShow);

      if (!shouldShow) {
        setOpen(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div
      className={[
        "fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 lg:hidden",
        "transition-all duration-300",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "flex flex-col items-end gap-3 transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        ].join(" ")}
      >
        <a
          href={`tel:+${PHONE_NUMBER}`}
          className="group flex items-center gap-3 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-bold text-heading shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-0.5"
          aria-label="Call EcoSurfaceCare"
        >
          <span>Call us</span>

          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#17352f] text-white">
            <Phone size={20} />
          </span>
        </a>

        <a
          href={`https://wa.me/${PHONE_NUMBER}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-bold text-heading shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-0.5"
          aria-label="Message EcoSurfaceCare on WhatsApp"
        >
          <span>WhatsApp</span>

          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white">
            <MessageCircle size={21} />
          </span>
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={[
          "grid h-14 w-14 place-items-center rounded-full text-white shadow-2xl",
          "transition duration-300 hover:scale-105 focus-visible:outline-none",
          "focus-visible:ring-4 focus-visible:ring-emerald-200",
          open ? "rotate-90 bg-forest" : "bg-brand",
        ].join(" ")}
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
