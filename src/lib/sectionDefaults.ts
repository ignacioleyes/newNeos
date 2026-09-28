import type { SectionKind } from "./sections";

/**
 * Etiquetas y payloads iniciales de cada tipo de sección.
 *
 * Una sección recién creada arranca con la forma correcta pero vacía, no con
 * `{}`. Si arrancara vacía, el renderer de la landing se caería al leer
 * `data.images.map` sobre un undefined, y el editor tendría que defenderse en
 * cada campo.
 */

export const SECTION_LABELS: Record<SectionKind, string> = {
  hero: "Portada",
  specs: "Barra de datos",
  what_is: "¿Qué es?",
  context: "Contexto",
  amenities: "Amenities",
  pull_quote: "Frase destacada",
  masterplan: "Master plan",
  gallery: "Galería",
  cta: "Cierre",
};

export const SECTION_HINTS: Record<SectionKind, string> = {
  hero: "La portada: carrusel de imágenes, título y los dos botones.",
  specs: "La franja de datos bajo la portada. Ubicación, unidades y tipología salen del proyecto.",
  what_is: "Texto largo con métricas y una imagen al costado.",
  context: "Por qué invertir en la zona: tarjetas con razones.",
  amenities: "Grilla de amenities. Salen de los que tenga cargados el proyecto.",
  pull_quote: "Una frase grande y centrada.",
  masterplan: "Plano del proyecto y sus etapas.",
  gallery: "Grilla de imágenes con epígrafes.",
  cta: "Cierre con el número grande de inversión y tarjetas de contacto.",
};

const empty = { es: "", en: "" };

export function defaultSectionData(kind: SectionKind): unknown {
  switch (kind) {
    case "hero":
      return {
        images: [],
        ctaHref: "#contacto",
        ctaLabel: { es: "Solicitar info", en: "Request info" },
        showDescription: true,
      };
    case "specs":
      return { extra: [] };
    case "what_is":
      return {
        title: empty,
        body: { es: [], en: [] },
        metrics: [],
        image: "",
      };
    case "context":
      return { eyebrow: empty, title: empty, subtitle: empty, reasons: [] };
    case "amenities":
      return {};
    case "pull_quote":
      return { quote: empty };
    case "masterplan":
      return { eyebrow: empty, title: empty, image: "", stages: [] };
    case "gallery":
      return {
        eyebrow: { es: "Galería", en: "Gallery" },
        title: { es: "El proyecto en imágenes.", en: "The project in pictures." },
        images: [],
      };
    case "cta":
      return {
        eyebrow: empty,
        lead: empty,
        body: empty,
        cards: [],
      };
  }
}

/**
 * El orden canónico en el que conviene que aparezcan.
 *
 * Se usa para sugerir la posición al agregar una sección nueva: si alguien
 * agrega la galería teniendo ya el cierre, tiene más sentido que caiga antes
 * del cierre que al final de todo.
 */
export const CANONICAL_ORDER: SectionKind[] = [
  "hero",
  "specs",
  "what_is",
  "context",
  "amenities",
  "pull_quote",
  "masterplan",
  "gallery",
  "cta",
];
