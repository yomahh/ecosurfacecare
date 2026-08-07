import { useEffect, useState } from "react";

export default function AnimatedLogoIntro() {
  const alreadyPlayed =
    sessionStorage.getItem("ecosurfacecare-intro-played") === "true";

  const [visible, setVisible] = useState(!alreadyPlayed);
  const [leaving, setLeaving] = useState(false);

  const closeIntro = () => {
    sessionStorage.setItem("ecosurfacecare-intro-played", "true");

    setLeaving(true);

    window.setTimeout(() => {
      setVisible(false);
    }, 500);
  };

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      closeIntro();
    }, 5000);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] grid place-items-center",
        "bg-[#102f14] transition-all duration-500",
        leaving
          ? "pointer-events-none scale-[1.02] opacity-0"
          : "opacity-100",
      ].join(" ")}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={closeIntro}
        className="h-full w-full object-cover"
      >
        <source src="/videos/animated-logo.mp4" type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={closeIntro}
        className="absolute bottom-8 right-8 rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/50"
      >
        Skip
      </button>
    </div>
  );
}
