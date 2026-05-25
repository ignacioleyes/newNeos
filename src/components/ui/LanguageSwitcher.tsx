import { useLang } from "../../i18n/LanguageContext";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, toggle } = useLang();
  const next = lang === "es" ? "EN" : "ES";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch language to ${next}`}
      title={`Switch to ${next}`}
      className={`group inline-flex items-center gap-2 text-sm font-medium tracking-wide hover:text-primary transition-colors ${className ?? ""}`.trim()}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a13 13 0 010 18M12 3a13 13 0 000 18" />
      </svg>
      <span className="uppercase text-xs tracking-[0.25em] opacity-80 group-hover:opacity-100">
        {next}
      </span>
    </button>
  );
}
