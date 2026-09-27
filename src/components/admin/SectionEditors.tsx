import type { ReactNode } from "react";
import {
  LocalizedField,
  LocalizedListField,
  TextField,
} from "./Field";
import { ImagePicker } from "./ImagePicker";
import type {
  CtaData,
  GalleryData,
  HeroData,
  SectionKind,
  SpecsData,
  WhatIsData,
} from "../../lib/sections";

/**
 * Editores de cada tipo de sección.
 *
 * Todos siguen el mismo contrato: reciben el payload y un `onChange` que
 * devuelve el payload completo. El guardado lo maneja la página, no cada
 * editor, así que acá no hay estado ni llamadas a la base.
 *
 * Los títulos usan [corchetes] para el fragmento resaltado. Cada campo que lo
 * admite lo dice en su hint: es la convención menos obvia del sistema y no se
 * descubre sola.
 */

const HIGHLIGHT_HINT =
  "Encerrá entre [corchetes] la parte que va en rosa. Ej: Más de [20.000 m²] de desarrollo.";

/** Lista editable de items con agregar, quitar y mover. */
function ItemList({
  items,
  onAdd,
  onRemove,
  onMove,
  addLabel,
  renderItem,
  emptyText,
}: {
  items: unknown[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onMove: (i: number, delta: number) => void;
  addLabel: string;
  renderItem: (index: number) => ReactNode;
  emptyText: string;
}) {
  return (
    <div className="mb-6">
      {items.length === 0 ? (
        <p className="mb-3 rounded-xl border border-dashed border-base-300 p-4 text-xs opacity-55">
          {emptyText}
        </p>
      ) : (
        <ul className="mb-3 space-y-3">
          {items.map((_, i) => (
            <li
              key={i}
              className="rounded-xl border border-base-300/60 bg-base-100 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-widest opacity-40">
                  #{i + 1}
                </span>
                <span className="flex gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => onMove(i, -1)}
                    className="btn btn-ghost btn-xs px-2 enabled:hover:text-primary disabled:opacity-20"
                    aria-label="Subir"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={i === items.length - 1}
                    onClick={() => onMove(i, 1)}
                    className="btn btn-ghost btn-xs px-2 enabled:hover:text-primary disabled:opacity-20"
                    aria-label="Bajar"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="btn btn-ghost btn-xs px-2 hover:text-error"
                    aria-label="Quitar"
                  >
                    ✕
                  </button>
                </span>
              </div>
              {renderItem(i)}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="btn btn-ghost btn-sm rounded-full border border-base-content/20 hover:border-primary hover:text-primary transition-colors"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/** Mueve un elemento del array, devolviendo uno nuevo. */
function moved<T>(arr: T[], i: number, delta: number): T[] {
  const target = i + delta;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[target]] = [next[target], next[i]];
  return next;
}

const EMPTY_L = { es: "", en: "" };

// -----------------------------------------------------------------------------

function HeroEditor({
  slug,
  data,
  onChange,
}: {
  slug: string;
  data: HeroData;
  onChange: (d: HeroData) => void;
}) {
  const images = data.images ?? [];
  return (
    <>
      <p className="mb-4 text-xs opacity-55 leading-relaxed">
        El título y la descripción del hero salen del proyecto (tagline y
        descripción). Acá se configura el carrusel y los botones.
      </p>

      <p className="mb-2 text-[10px] uppercase tracking-widest text-primary">
        Imágenes del carrusel
      </p>
      <ItemList
        items={images}
        addLabel="Agregar imagen"
        emptyText="Sin imágenes: el carrusel va a quedar vacío."
        onAdd={() => onChange({ ...data, images: [...images, { src: "" }] })}
        onRemove={(i) =>
          onChange({ ...data, images: images.filter((_, j) => j !== i) })
        }
        onMove={(i, d) => onChange({ ...data, images: moved(images, i, d) })}
        renderItem={(i) => (
          <ImagePicker
            slug={slug}
            label={`Imagen ${i + 1}`}
            value={images[i].src}
            onChange={(url) => {
              const next = [...images];
              next[i] = { ...next[i], src: url };
              onChange({ ...data, images: next });
            }}
          />
        )}
      />

      <LocalizedField
        label="Texto del botón principal"
        value={data.ctaLabel ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, ctaLabel: v })}
      />
      <TextField
        label="A dónde lleva"
        hint="Un ancla de la misma página, ej. #amenities o #avance-de-obra. El segundo botón siempre va a contacto."
        value={data.ctaHref ?? ""}
        onChange={(v) => onChange({ ...data, ctaHref: v })}
      />

      <label className="mb-6 flex cursor-pointer items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="checkbox checkbox-sm checkbox-primary"
          checked={data.showDescription ?? false}
          onChange={(e) => onChange({ ...data, showDescription: e.target.checked })}
        />
        Mostrar la descripción del proyecto bajo el título
      </label>
    </>
  );
}

// -----------------------------------------------------------------------------

function SpecsEditor({
  data,
  onChange,
}: {
  data: SpecsData;
  onChange: (d: SpecsData) => void;
}) {
  const extra = data.extra ?? [];
  return (
    <>
      <p className="mb-4 text-xs opacity-55 leading-relaxed">
        Ubicación, unidades y tipología se toman del proyecto, así que se editan
        una sola vez allá. Acá se agregan los datos destacados propios de esta
        página — los que salen en rosa y más grandes.
      </p>
      <ItemList
        items={extra}
        addLabel="Agregar dato"
        emptyText="Sin datos extra: la barra muestra sólo lo que viene del proyecto."
        onAdd={() =>
          onChange({ ...data, extra: [...extra, { label: EMPTY_L, value: EMPTY_L }] })
        }
        onRemove={(i) =>
          onChange({ ...data, extra: extra.filter((_, j) => j !== i) })
        }
        onMove={(i, d) => onChange({ ...data, extra: moved(extra, i, d) })}
        renderItem={(i) => (
          <>
            <LocalizedField
              label="Etiqueta"
              value={extra[i].label}
              onChange={(v) => {
                const next = [...extra];
                next[i] = { ...next[i], label: v };
                onChange({ ...data, extra: next });
              }}
            />
            <LocalizedField
              label="Valor"
              value={extra[i].value}
              onChange={(v) => {
                const next = [...extra];
                next[i] = { ...next[i], value: v };
                onChange({ ...data, extra: next });
              }}
            />
          </>
        )}
      />
    </>
  );
}

// -----------------------------------------------------------------------------

function WhatIsEditor({
  slug,
  data,
  onChange,
}: {
  slug: string;
  data: WhatIsData;
  onChange: (d: WhatIsData) => void;
}) {
  const metrics = data.metrics ?? [];
  return (
    <>
      <LocalizedField
        label="Antetítulo"
        hint="Opcional. Si lo dejás vacío se arma «¿Qué es <nombre del proyecto>?»."
        value={data.eyebrow ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, eyebrow: v })}
      />
      <LocalizedField
        label="Título"
        hint={HIGHLIGHT_HINT}
        value={data.title ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, title: v })}
      />
      <LocalizedListField
        label="Párrafos"
        hint="Uno por línea. Cada línea es un párrafo aparte."
        value={data.body ?? { es: [], en: [] }}
        onChange={(v) => onChange({ ...data, body: v })}
      />

      <p className="mb-2 text-[10px] uppercase tracking-widest text-primary">
        Métricas
      </p>
      <ItemList
        items={metrics}
        addLabel="Agregar métrica"
        emptyText="Sin métricas: no se muestra la fila de números."
        onAdd={() =>
          onChange({ ...data, metrics: [...metrics, { value: "", label: EMPTY_L }] })
        }
        onRemove={(i) =>
          onChange({ ...data, metrics: metrics.filter((_, j) => j !== i) })
        }
        onMove={(i, d) => onChange({ ...data, metrics: moved(metrics, i, d) })}
        renderItem={(i) => (
          <>
            <TextField
              label="Número"
              hint="Se muestra tal cual. Ej: 164, +20.000, 100%"
              value={metrics[i].value}
              onChange={(v) => {
                const next = [...metrics];
                next[i] = { ...next[i], value: v };
                onChange({ ...data, metrics: next });
              }}
            />
            <LocalizedField
              label="Qué mide"
              value={metrics[i].label}
              onChange={(v) => {
                const next = [...metrics];
                next[i] = { ...next[i], label: v };
                onChange({ ...data, metrics: next });
              }}
            />
          </>
        )}
      />

      <ImagePicker
        slug={slug}
        label="Imagen al costado"
        value={data.image ?? ""}
        onChange={(url) => onChange({ ...data, image: url })}
        onClear={() => onChange({ ...data, image: "" })}
      />
    </>
  );
}

// -----------------------------------------------------------------------------

function GalleryEditor({
  slug,
  data,
  onChange,
}: {
  slug: string;
  data: GalleryData;
  onChange: (d: GalleryData) => void;
}) {
  const images = data.images ?? [];
  return (
    <>
      <LocalizedField
        label="Antetítulo"
        value={data.eyebrow ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, eyebrow: v })}
      />
      <LocalizedField
        label="Título"
        value={data.title ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, title: v })}
      />

      <ItemList
        items={images}
        addLabel="Agregar imagen"
        emptyText="Sin imágenes: la sección no se va a ver."
        onAdd={() =>
          onChange({ ...data, images: [...images, { src: "", label: EMPTY_L }] })
        }
        onRemove={(i) =>
          onChange({ ...data, images: images.filter((_, j) => j !== i) })
        }
        onMove={(i, d) => onChange({ ...data, images: moved(images, i, d) })}
        renderItem={(i) => (
          <>
            <ImagePicker
              slug={slug}
              label={`Imagen ${i + 1}`}
              value={images[i].src}
              onChange={(url) => {
                const next = [...images];
                next[i] = { ...next[i], src: url };
                onChange({ ...data, images: next });
              }}
            />
            <LocalizedField
              label="Epígrafe"
              value={images[i].label ?? EMPTY_L}
              onChange={(v) => {
                const next = [...images];
                next[i] = { ...next[i], label: v };
                onChange({ ...data, images: next });
              }}
            />
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={images[i].wide ?? false}
                onChange={(e) => {
                  const next = [...images];
                  next[i] = { ...next[i], wide: e.target.checked };
                  onChange({ ...data, images: next });
                }}
              />
              Ocupa el ancho completo
            </label>
          </>
        )}
      />
    </>
  );
}

// -----------------------------------------------------------------------------

function CtaEditor({
  data,
  onChange,
}: {
  data: CtaData;
  onChange: (d: CtaData) => void;
}) {
  const cards = data.cards ?? [];
  return (
    <>
      <LocalizedField
        label="Antetítulo"
        value={data.eyebrow ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, eyebrow: v })}
      />

      <p className="mb-2 text-[10px] uppercase tracking-widest text-primary">
        El número grande
      </p>
      <p className="mb-3 text-xs opacity-55 leading-relaxed">
        Se arma en tres partes: un texto antes, el número (que se anima contando
        hasta su valor) y un texto después. Ej: «Anticipo» · 40 · «% + 24 cuotas».
      </p>
      <LocalizedField
        label="Texto antes"
        value={data.lead ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, lead: v })}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <TextField
          label="Prefijo"
          hint="Ej: USD"
          value={data.amountPrefix ?? ""}
          onChange={(v) => onChange({ ...data, amountPrefix: v })}
        />
        <TextField
          label="Número"
          hint="Vacío = sin número"
          value={data.amount != null ? String(data.amount) : ""}
          onChange={(v) =>
            onChange({
              ...data,
              amount: v.trim() === "" ? undefined : Number(v),
            })
          }
        />
        <TextField
          label="Sufijo"
          hint="Ej: %"
          value={data.amountSuffix ?? ""}
          onChange={(v) => onChange({ ...data, amountSuffix: v })}
        />
      </div>
      <LocalizedField
        label="Texto después"
        value={data.trail ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, trail: v })}
      />
      <LocalizedField
        label="Párrafo"
        multiline
        value={data.body ?? EMPTY_L}
        onChange={(v) => onChange({ ...data, body: v })}
      />

      <p className="mb-2 text-[10px] uppercase tracking-widest text-primary">
        Tarjetas
      </p>
      <ItemList
        items={cards}
        addLabel="Agregar tarjeta"
        emptyText="Sin tarjetas: sólo se muestra el número y el párrafo."
        onAdd={() =>
          onChange({
            ...data,
            cards: [...cards, { title: EMPTY_L, body: EMPTY_L, href: "#contacto" }],
          })
        }
        onRemove={(i) => onChange({ ...data, cards: cards.filter((_, j) => j !== i) })}
        onMove={(i, d) => onChange({ ...data, cards: moved(cards, i, d) })}
        renderItem={(i) => (
          <>
            <LocalizedField
              label="Título"
              value={cards[i].title}
              onChange={(v) => {
                const next = [...cards];
                next[i] = { ...next[i], title: v };
                onChange({ ...data, cards: next });
              }}
            />
            <LocalizedField
              label="Texto"
              value={cards[i].body}
              onChange={(v) => {
                const next = [...cards];
                next[i] = { ...next[i], body: v };
                onChange({ ...data, cards: next });
              }}
            />
            <TextField
              label="A dónde lleva"
              value={cards[i].href}
              onChange={(v) => {
                const next = [...cards];
                next[i] = { ...next[i], href: v };
                onChange({ ...data, cards: next });
              }}
            />
          </>
        )}
      />
    </>
  );
}

// -----------------------------------------------------------------------------

export function SectionEditor({
  kind,
  slug,
  data,
  onChange,
}: {
  kind: SectionKind;
  slug: string;
  data: unknown;
  onChange: (d: unknown) => void;
}) {
  switch (kind) {
    case "hero":
      return <HeroEditor slug={slug} data={data as HeroData} onChange={onChange} />;
    case "specs":
      return <SpecsEditor data={data as SpecsData} onChange={onChange} />;
    case "what_is":
      return <WhatIsEditor slug={slug} data={data as WhatIsData} onChange={onChange} />;
    case "gallery":
      return <GalleryEditor slug={slug} data={data as GalleryData} onChange={onChange} />;
    case "cta":
      return <CtaEditor data={data as CtaData} onChange={onChange} />;
    case "amenities":
      return (
        <p className="text-sm opacity-60 leading-relaxed">
          Esta sección no tiene nada que configurar: muestra los amenities que
          tenga cargados el proyecto.
        </p>
      );
    default:
      return (
        <p className="rounded-xl border border-dashed border-base-300 p-4 text-sm opacity-60 leading-relaxed">
          El editor de este tipo de sección todavía no está hecho. Podés
          mostrarla, ocultarla, moverla o borrarla, pero su contenido se edita
          por base.
        </p>
      );
  }
}
