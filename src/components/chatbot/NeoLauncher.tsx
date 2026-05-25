import { useCallback, useEffect, useState } from "react";
import { NeoButton } from "./NeoButton";
import { NeoChat } from "./NeoChat";

const PROACTIVE_DELAY_MS = 20_000;
const PROACTIVE_SCROLL_PCT = 0.5;
const SESSION_KEY = "neos.neo.shown";

/**
 * Mount-once para el chatbot. Maneja:
 *   - Estado open/close del widget
 *   - Trigger proactivo (badge pulsante) tras 20s o 50% scroll, 1 vez por sesión
 *
 * NeoChat queda montado siempre — así el state de la conversación (useChatbot)
 * persiste entre cierres/aperturas. La visibilidad la controla el `open` prop.
 *
 * Render order importante: NeoChat primero, NeoButton después — para que el FAB
 * gane el z-stack en mobile donde el widget es full-screen.
 */
export function NeoLauncher() {
  const [open, setOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let triggered = false;

    function trigger(reason: "time" | "scroll") {
      if (triggered) return;
      triggered = true;
      try {
        sessionStorage.setItem(SESSION_KEY, reason);
      } catch {
        // sessionStorage puede fallar en private mode — no es crítico
      }
      setShowBadge(true);
    }

    const timer = window.setTimeout(() => trigger("time"), PROACTIVE_DELAY_MS);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = window.scrollY / max;
      if (pct >= PROACTIVE_SCROLL_PCT) trigger("scroll");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleToggle = useCallback(() => {
    setOpen((v) => !v);
    setShowBadge(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <NeoChat open={open} onClose={handleClose} />
      <NeoButton
        open={open}
        onClick={handleToggle}
        showProactiveBadge={showBadge}
      />
    </>
  );
}
