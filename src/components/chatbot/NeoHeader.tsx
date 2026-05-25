import { useT } from "../../i18n/LanguageContext";
import { NeosMark } from "../ui/NeosMark";

interface NeoHeaderProps {
  onClose: () => void;
}

/**
 * Header del panel del chatbot. Avatar magenta con iso NEOS,
 * título + subtítulo con indicador "online", y botón de cerrar.
 */
export function NeoHeader({ onClose }: NeoHeaderProps) {
  const t = useT();

  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-base-300/40 bg-base-100">
      {/* Avatar magenta con iso blanco */}
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
        <NeosMark className="h-5 w-5" />
      </div>

      {/* Título + estado online */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight font-display">
          {t.neo.header.title}
        </p>
        <p className="text-xs opacity-60 leading-tight flex items-center gap-1.5 mt-0.5">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          {t.neo.header.subtitle}
        </p>
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t.neo.header.closeLabel}
        className="flex-shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-base-200 hover:text-primary transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </svg>
      </button>
    </header>
  );
}
