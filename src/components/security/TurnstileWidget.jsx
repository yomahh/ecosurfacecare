import { useEffect, useRef } from "react";

const SCRIPT_ID = "cloudflare-turnstile-script";

export default function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      console.error("VITE_TURNSTILE_SITE_KEY is not configured.");
      return;
    }

    const renderWidget = () => {
      if (
        !window.turnstile ||
        !containerRef.current ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(
        containerRef.current,
        {
          sitekey: siteKey,

          callback(token) {
            onVerify(token);
          },

          "expired-callback"() {
            onExpire?.();
          },

          "error-callback"() {
            onError?.();
          },

          theme: "auto",
        },
      );
    };

    const existingScript =
      document.getElementById(SCRIPT_ID);

    if (existingScript) {
      if (window.turnstile) {
        renderWidget();
      } else {
        existingScript.addEventListener(
          "load",
          renderWidget,
          { once: true },
        );
      }
    } else {
      const script = document.createElement("script");

      script.id = SCRIPT_ID;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

      script.async = true;
      script.defer = true;

      script.addEventListener(
        "load",
        renderWidget,
        { once: true },
      );

      document.head.appendChild(script);
    }

    return () => {
      if (
        window.turnstile &&
        widgetIdRef.current !== null
      ) {
        window.turnstile.remove(
          widgetIdRef.current,
        );
      }

      widgetIdRef.current = null;
    };
  }, [onVerify, onExpire, onError]);

  return (
    <div
      ref={containerRef}
      className="min-h-[65px]"
    />
  );
}
