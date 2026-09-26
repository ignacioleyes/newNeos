import type { Localized } from "../i18n/types";

/**
 * Modelo de las secciones de una página de proyecto.
 *
 * Cada `kind` tiene su payload y su renderer. Una sección que un proyecto no
 * tiene es simplemente una fila que no existe, y el orden lo define `position`
 * — por eso son filas y no columnas fijas: Chaquíes pone amenities antes del
 * pull quote y Neweken pone el quote antes del master plan.
 *
 * CONVENCIÓN DE TÍTULOS: el fragmento resaltado va [entre corchetes], no
 * partido en tres campos titleA/highlight/titleB. Nadie puede escribir un
 * título llenando tres inputs; con el marcador es una sola frase.
 *
 *   "Más de [20.000 m²] de desarrollo en el corazón de Cafayate."
 */

export const SECTION_KINDS = [
  "hero",
  "specs",
  "what_is",
  "context",
  "amenities",
  "pull_quote",
  "masterplan",
  "gallery",
  "cta",
] as const;

export type SectionKind = (typeof SECTION_KINDS)[number];

export interface ProjectSection {
  id: string;
  kind: SectionKind;
  position: number;
  isVisible: boolean;
  data: unknown;
}

// -----------------------------------------------------------------------------
// Payloads
// -----------------------------------------------------------------------------

export interface HeroData {
  images: { src: string; alt?: string }[];
  /** Ancla del botón primario, ej. "#amenities" o "#avance-de-obra". */
  ctaHref: string;
  ctaLabel: Localized<string>;
  /** Chaquíes muestra la descripción bajo el título; Neweken no. */
  showDescription?: boolean;
}

/**
 * La barra de specs toma ubicación, unidades y tipología del propio proyecto,
 * para que editarlas en un solo lugar alcance. `extra` es el dato destacado,
 * que cambia por proyecto (distancia a la plaza, inversión desde, etc).
 */
export interface SpecsData {
  extra?: { label: Localized<string>; value: Localized<string> }[];
}

export interface WhatIsData {
  /** Si falta, el renderer arma "¿Qué es <nombre>?". */
  eyebrow?: Localized<string>;
  title: Localized<string>;
  body: Localized<string[]>;
  metrics: { value: string; label: Localized<string> }[];
  image?: string;
}

export interface ContextData {
  eyebrow: Localized<string>;
  title: Localized<string>;
  subtitle?: Localized<string>;
  /** Array y no reason1/reason2/reason3: pueden ser 2, 3 o 4. */
  reasons: {
    eyebrow: Localized<string>;
    title: Localized<string>;
    body: Localized<string>;
  }[];
}

export interface AmenitiesData {
  eyebrow?: Localized<string>;
  title?: Localized<string>;
}

export interface PullQuoteData {
  /** Si falta, el renderer usa el hashtag del proyecto. */
  eyebrow?: Localized<string>;
  quote: Localized<string>;
}

export interface MasterplanData {
  eyebrow: Localized<string>;
  title: Localized<string>;
  image: string;
  stages: { name: string; status: Localized<string>; active?: boolean }[];
}

export interface GalleryData {
  eyebrow: Localized<string>;
  title: Localized<string>;
  /** `wide` hace que la imagen ocupe las dos columnas. */
  images: { src: string; label: Localized<string>; wide?: boolean }[];
}

export type CtaIcon = "blueprint" | "document" | "play";

export interface CtaData {
  eyebrow: Localized<string>;
  /** Texto antes del número grande, ej. "Anticipo" o "Desde". */
  lead: Localized<string>;
  /** El número se anima con CountUp. Sin `amount`, se muestra sólo el texto. */
  amountPrefix?: string;
  amount?: number;
  amountSuffix?: string;
  /** Texto después del número, ej. " + 24 cuotas". */
  trail?: Localized<string>;
  body: Localized<string>;
  cards: {
    icon?: CtaIcon;
    title: Localized<string>;
    body: Localized<string>;
    href: string;
  }[];
}
