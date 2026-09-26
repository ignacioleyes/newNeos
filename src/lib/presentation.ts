import type { Localized } from "../i18n/types";
import type { ProjectStatus } from "../data/projects";

/**
 * Presets visuales que la base referencia por key.
 *
 * IMPORTANTE: las clases tienen que estar escritas literales acá. Tailwind
 * escanea el código fuente y purga todo lo que no encuentra, así que una clase
 * construida dinámicamente (`from-${color}-600/40`) NO existiría en el CSS
 * final. Por eso la base guarda una key y no el string de clases: un gradiente
 * inventado desde el panel de admin no tendría estilos.
 *
 * Agregar un preset nuevo = agregarlo acá Y al check constraint de la columna
 * `gradient_key` en la migración correspondiente.
 */
export const PROJECT_GRADIENTS = {
  amber: "from-amber-600/40 via-rose-700/30 to-zinc-900",
  pink: "from-pink-500/40 via-fuchsia-600/30 to-zinc-900",
  orange: "from-orange-500/40 via-amber-700/30 to-zinc-900",
  emerald: "from-emerald-600/40 via-teal-700/30 to-zinc-900",
  sky: "from-sky-600/40 via-emerald-700/30 to-zinc-900",
} as const;

export const REGION_GRADIENTS = {
  rose: "from-rose-600/30 to-zinc-900",
  amber: "from-amber-600/30 to-zinc-900",
  fuchsia: "from-fuchsia-700/30 to-zinc-900",
} as const;

export type ProjectGradientKey = keyof typeof PROJECT_GRADIENTS;
export type RegionGradientKey = keyof typeof REGION_GRADIENTS;

const DEFAULT_PROJECT_GRADIENT = PROJECT_GRADIENTS.amber;
const DEFAULT_REGION_GRADIENT = REGION_GRADIENTS.rose;

/** Resuelve la key a clases. Cae al default si la key no existe (base más nueva que el front). */
export function projectGradient(key: string | null | undefined): string {
  return PROJECT_GRADIENTS[key as ProjectGradientKey] ?? DEFAULT_PROJECT_GRADIENT;
}

export function regionGradient(key: string | null | undefined): string {
  return REGION_GRADIENTS[key as RegionGradientKey] ?? DEFAULT_REGION_GRADIENT;
}

/**
 * Etiqueta visible de cada estado.
 *
 * La base guarda sólo `status`; la etiqueta se deriva acá. Guardar las dos
 * cosas en la base garantiza que tarde o temprano queden inconsistentes.
 */
export const STATUS_LABELS: Record<ProjectStatus, Localized<string>> = {
  anteproyecto: { es: "Anteproyecto", en: "Pre-project" },
  "en-obra": { es: "En obra", en: "Under construction" },
  lanzamiento: { es: "Lanzamiento", en: "Launching" },
  finalizado: { es: "Finalizado", en: "Completed" },
};

export function statusLabel(status: string): Localized<string> {
  return STATUS_LABELS[status as ProjectStatus] ?? STATUS_LABELS["en-obra"];
}

/**
 * Cuántos proyectos entran en la composición de la grilla de la home.
 *
 * La grilla es de 4 columnas y el destacado ocupa 2x2, así que con 5 proyectos
 * las celdas cierran exactas (4 + 4 = 8 = 2 filas). Con otra cantidad la última
 * fila queda dentada. Los que exceden este corte van a la lista de trayectoria.
 */
export const GRID_CAPACITY = 5;
