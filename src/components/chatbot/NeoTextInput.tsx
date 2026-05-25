import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

interface NeoTextInputProps {
  type: "text" | "email" | "tel";
  placeholder: string;
  /** Label de a11y para el botón de submit (no se muestra). */
  submitLabel: string;
  /** Valida el valor trimmeado. Retorna `null` si es válido, string con el error si no. */
  validate: (value: string) => string | null;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * Input + botón send. Aparece en el footer del widget cuando el step
 * actual tiene `input: "text_input"`. Maneja validación inline y limpia
 * el error al primer keystroke después de fallar.
 */
export function NeoTextInput({
  type,
  placeholder,
  submitLabel,
  validate,
  onSubmit,
  disabled = false,
  autoFocus = true,
}: NeoTextInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus tras la animación del widget
  useEffect(() => {
    if (!autoFocus || disabled) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [autoFocus, disabled]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (error) setError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const err = validate(trimmed);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onSubmit(trimmed);
    setValue("");
  }

  const autoComplete =
    type === "email" ? "email" : type === "tel" ? "tel" : "name";

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <div className="flex gap-2 items-stretch">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={placeholder}
          aria-invalid={error !== null}
          autoComplete={autoComplete}
          className={`
            flex-1 min-w-0 px-4 py-2.5 text-sm rounded-full
            border bg-base-100
            placeholder:text-base-content/40
            focus:outline-none focus:ring-2
            transition-colors
            disabled:opacity-50
            ${
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-base-300/70 focus:border-primary focus:ring-primary/20"
            }
          `}
        />
        <button
          type="submit"
          aria-label={submitLabel}
          disabled={disabled || value.trim().length === 0}
          className="
            flex-shrink-0 h-11 w-11 rounded-full
            bg-primary text-white
            inline-flex items-center justify-center
            hover:scale-105 active:scale-95
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {error && (
        <p className="text-xs text-error px-2" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
