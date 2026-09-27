import type { ReactNode } from "react";
import type { Localized } from "../../i18n/types";

/**
 * Campos del formulario del panel.
 *
 * Todo el contenido de la landing es bilingüe, así que casi todos los campos
 * son un par ES/EN. Ponerlos lado a lado y no en dos pestañas separadas es a
 * propósito: así se ve de un vistazo si falta traducir algo, en vez de tener
 * que acordarse de revisar la otra pestaña antes de guardar.
 */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6">
      <label className="block text-[10px] uppercase tracking-widest text-primary mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs opacity-50 leading-snug">{hint}</p>}
    </div>
  );
}

const INPUT =
  "input input-bordered w-full bg-base-100 focus:border-primary transition-colors";
const TEXTAREA =
  "textarea textarea-bordered w-full bg-base-100 focus:border-primary transition-colors leading-relaxed";

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="text"
        className={INPUT}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function SelectField({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        className="select select-bordered w-full bg-base-100 focus:border-primary transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Par ES/EN de una línea. */
export function LocalizedField({
  label,
  hint,
  value,
  onChange,
  multiline,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: Localized<string>;
  onChange: (v: Localized<string>) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const missing = !value.es.trim() || !value.en.trim();

  return (
    <Field label={label} hint={hint}>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["es", "en"] as const).map((lang) => (
          <div key={lang}>
            <span className="mb-1 block text-[9px] uppercase tracking-widest opacity-40">
              {lang}
            </span>
            {multiline ? (
              <textarea
                rows={rows}
                className={TEXTAREA}
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              />
            ) : (
              <input
                type="text"
                className={INPUT}
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
      {missing && (
        <p className="mt-1.5 text-xs text-warning/80">
          Falta uno de los dos idiomas.
        </p>
      )}
    </Field>
  );
}

/**
 * Listas bilingües (los highlights de cada card): una por línea.
 *
 * Un editor de items con botón de agregar y borrar sería más "app", pero para
 * dos o tres frases cortas el textarea es más rápido de usar y de entender.
 */
export function LocalizedListField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: Localized<string[]>;
  onChange: (v: Localized<string[]>) => void;
}) {
  const uneven = value.es.length !== value.en.length;

  return (
    <Field label={label} hint={hint}>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["es", "en"] as const).map((lang) => (
          <div key={lang}>
            <span className="mb-1 block text-[9px] uppercase tracking-widest opacity-40">
              {lang} · {value[lang].length} ítems
            </span>
            <textarea
              rows={4}
              className={TEXTAREA}
              value={value[lang].join("\n")}
              onChange={(e) =>
                onChange({
                  ...value,
                  // Las líneas vacías se descartan al guardar, no mientras se
                  // escribe: filtrar en vivo haría que Enter no funcione.
                  [lang]: e.target.value.split("\n"),
                })
              }
            />
          </div>
        ))}
      </div>
      {uneven && (
        <p className="mt-1.5 text-xs text-warning/80">
          Las dos listas tienen distinta cantidad de ítems.
        </p>
      )}
    </Field>
  );
}
