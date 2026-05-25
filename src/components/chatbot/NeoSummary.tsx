export interface SummaryItem {
  label: string;
  value: string;
}

interface NeoSummaryProps {
  items: SummaryItem[];
  confirmLabel: string;
  editLabel: string;
  sendingLabel: string;
  retryLabel: string;
  onConfirm: () => void;
  onEdit: () => void;
  /** true mientras se hace el INSERT en Supabase */
  sending?: boolean;
  /** Mensaje de error si el envío falló — null si no hay error */
  error?: string | null;
}

/**
 * Card de resumen que aparece en el step `confirm`. Muestra los datos
 * capturados (nombre, contacto, interés, zona, proyecto) en formato
 * label · value, con botones [Editar] / [Confirmar y enviar].
 *
 * Maneja 3 estados:
 *   - idle:    botones normales
 *   - sending: spinner en confirm, edit deshabilitado
 *   - error:   muestra mensaje + botón Confirmar se transforma en Reintentar
 */
export function NeoSummary({
  items,
  confirmLabel,
  editLabel,
  sendingLabel,
  retryLabel,
  onConfirm,
  onEdit,
  sending = false,
  error = null,
}: NeoSummaryProps) {
  const showRetry = error !== null && !sending;

  return (
    <div className="p-4 space-y-3">
      {/* Resumen */}
      <div className="rounded-2xl border border-base-300/60 bg-base-100 p-4 space-y-2.5 shadow-sm">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <span className="text-base-content/60 flex-shrink-0">
              {item.label}
            </span>
            <span className="text-base-content font-medium text-right break-words">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="text-xs text-error px-2" role="alert">
          {error}
        </p>
      )}

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={sending}
          className="
            flex-1 px-4 py-2.5 rounded-full text-sm font-medium
            border border-base-300/70 bg-base-100
            hover:border-primary hover:text-primary
            transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-base-300/70 disabled:hover:text-base-content
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
          "
        >
          {editLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={sending}
          className="
            flex-1 px-4 py-2.5 rounded-full text-sm font-semibold
            bg-primary text-white
            hover:bg-primary/90 active:scale-95
            transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100
            inline-flex items-center justify-center gap-2
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
          "
        >
          {sending && (
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="4"
              />
              <path
                d="M22 12a10 10 0 01-10 10"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          )}
          {sending ? sendingLabel : showRetry ? retryLabel : confirmLabel}
        </button>
      </div>
    </div>
  );
}
