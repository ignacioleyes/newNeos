import { useEffect, type ReactNode } from "react";
import { NeoHeader } from "./NeoHeader";

interface NeoWidgetProps {
  open: boolean;
  onClose: () => void;
  /** Cuerpo del widget — usualmente la lista de mensajes. Scrollea. */
  children: ReactNode;
  /** Área pinned abajo — input, quick replies, summary. Opcional. */
  footer?: ReactNode;
}

/**
 * Panel del chatbot Neo.
 *
 * Mobile (< 640px): overlay full-screen con backdrop, slide-up desde abajo.
 * Desktop (>= 640px): panel flotante 380-400 × 600-640 anclado bottom-right,
 * fade + slight slide+scale, sin backdrop (la página sigue interactiva).
 *
 * Estructura interna:
 *   ┌────────────────┐
 *   │  NeoHeader     │  fixed top
 *   ├────────────────┤
 *   │  children      │  flex-1, scrollable
 *   ├────────────────┤
 *   │  footer        │  pinned bottom (opcional)
 *   └────────────────┘
 */
export function NeoWidget({ open, onClose, children, footer }: NeoWidgetProps) {
  // Esc cierra
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock scroll del body solo en mobile (donde el widget es full-screen)
  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 640) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      {/* Backdrop — solo mobile */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Neo chatbot"
        className={`
          fixed z-50
          inset-0 sm:inset-auto
          sm:bottom-24 sm:right-6
          w-full sm:w-[380px] lg:w-[400px]
          h-full sm:h-[600px] lg:h-[640px] sm:max-h-[calc(100vh-8rem)]
          bg-base-100
          sm:rounded-2xl
          sm:border sm:border-base-300/60
          shadow-2xl
          flex flex-col
          overflow-hidden
          transition-all duration-300 ease-out
          ${
            open
              ? "translate-y-0 opacity-100 sm:scale-100 pointer-events-auto"
              : "translate-y-full sm:translate-y-4 opacity-0 sm:scale-95 pointer-events-none"
          }
        `}
      >
        <NeoHeader onClose={onClose} />

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-base-200/30">
          {children}
        </div>

        {/* Footer pinned (opcional) */}
        {footer && (
          <div className="flex-shrink-0 border-t border-base-300/40 bg-base-100">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
