export interface QuickReplyOption {
  /** Valor que se manda al state machine (ej: "inversion") */
  value: string;
  /** Texto que ve el usuario (ej: "Quiero invertir") — se usa también como burbuja del user */
  label: string;
}

interface NeoQuickRepliesProps {
  options: QuickReplyOption[];
  onSelect: (value: string, label: string) => void;
  /** Deshabilitar mientras Neo está "escribiendo" o enviando */
  disabled?: boolean;
}

/**
 * Botones de respuesta rápida (chips) que aparecen en el footer del widget
 * cuando el step actual tiene `input: "quick_replies"`.
 *
 * El padre arma `options` mapeando `STEP_CONFIGS[currentStep].choices` con i18n.
 */
export function NeoQuickReplies({
  options,
  onSelect,
  disabled = false,
}: NeoQuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option.value, option.label)}
          className={`
            inline-flex items-center px-4 py-2.5 rounded-full
            text-sm font-medium
            border border-base-300/70 bg-base-100
            hover:border-primary hover:text-primary hover:bg-primary/5
            active:scale-95
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
            ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
