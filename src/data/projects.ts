import type { Localized } from "../i18n/types";

export type ProjectStatus =
  | "anteproyecto"
  | "en-obra"
  | "lanzamiento"
  | "finalizado";

export interface Amenity {
  /** Canonical key for AmenityIcon lookup (lowercase ES). */
  key: string;
  label: Localized<string>;
}

export interface Project {
  /** PK. La usa el panel para insertar secciones; la landing no la necesita. */
  id: string;
  slug: string;
  name: string;
  hashtag?: string;
  tagline: Localized<string>;
  description: Localized<string>;
  about?: Localized<string>;
  location: Localized<string>;
  region: string;
  status: ProjectStatus;
  statusLabel: Localized<string>;
  units?: Localized<string>;
  tipologias?: Localized<string>;
  amenities?: Amenity[];
  services?: Localized<string[]>;
  highlights: Localized<string[]>;
  investment?: Localized<string>;
  heroImage: string;
  logo?: string;
  brochureUrl?: string;
  progressUrl?: string;
  videoEmbed?: string;
  mapsUrl?: string;
  gradient: string;

  /** Slug de la región (la FK real). `region` queda como el nombre visible. */
  regionSlug: string;
  /** La key del preset visual, no las clases. El panel edita esto. */
  gradientKey: string;
  /** Coordenadas del dot en el mapa de su región. Van juntas o no van. */
  lat?: number;
  lng?: number;
  /** Orden en la home. Los primeros `GRID_CAPACITY` arman la composición. */
  displayOrder: number;
  /** El que ocupa el card grande 2x2. Sólo puede haber uno. */
  isFeatured: boolean;
  /**
   * Un empleado logueado recibe también los despublicados (la RLS se los
   * permite), así que la landing filtra por este campo y el panel no.
   */
  isPublished: boolean;
}

/**
 * Snapshot del contenido publicado.
 *
 * Ya NO es la fuente de verdad — esa es Supabase. Este archivo se regenera con
 * `yarn snapshot` y se usa como `placeholderData` de las queries: la landing
 * pinta instantánea con el último snapshot conocido y se actualiza sola cuando
 * responde la base. Si Supabase está pausado o caído, la landing sigue
 * mostrando contenido en vez de romperse.
 */
export { projectsSnapshot as projects } from "./content.snapshot";
