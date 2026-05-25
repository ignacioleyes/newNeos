import { useT } from "../../i18n/LanguageContext";
import { NeosMark } from "../ui/NeosMark";

interface NeoButtonProps {
  open: boolean;
  onClick: () => void;
  showProactiveBadge?: boolean;
}

/**
 * FAB flotante del chatbot Neo.
 * - Cerrado: muestra el iso NEOS en blanco sobre fondo magenta.
 * - Abierto: rota a un ícono X (cierra el widget).
 * - Si `showProactiveBadge` está activo y está cerrado: muestra un dot pulsante.
 */
export function NeoButton({
  open,
  onClick,
  showProactiveBadge = false,
}: NeoButtonProps) {
  const t = useT();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? t.neo.header.closeLabel : t.neo.fab.label}
      aria-expanded={open}
      className="
        fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50
        h-14 w-14 sm:h-16 sm:w-16
        rounded-full bg-primary text-white
        shadow-[0_8px_30px_rgba(233,30,140,0.45)]
        hover:shadow-[0_12px_36px_rgba(233,30,140,0.6)]
        hover:scale-105 active:scale-95
        transition-all duration-300
        flex items-center justify-center
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40
      "
    >
      {/* Pulso continuo (estilo WhatsApp FAB) — solo cuando está cerrado */}
      {!open && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30"
        />
      )}

      {/* Iso (visible cuando está cerrado) */}
      <span
        aria-hidden={open}
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          open
            ? "opacity-0 scale-50 rotate-90"
            : "opacity-100 scale-100 rotate-0"
        }`}
      >
        <NeosMark className="h-7 w-7 sm:h-8 sm:w-8" />
      </span>

      {/* X (visible cuando está abierto) */}
      <span
        aria-hidden={!open}
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          open
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-50 -rotate-90"
        }`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </svg>
      </span>

      {/* Badge proactivo (dot blanco con pulse) */}
      {!open && showProactiveBadge && (
        <span
          aria-hidden
          className="absolute top-1 right-1 flex h-3 w-3"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
      )}
    </button>
  );
}
