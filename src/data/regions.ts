import type { Localized } from "../i18n/types";

export type DotStatus = "in-progress" | "finalized";

export interface MapDot {
  lat: number;
  lng: number;
  label: string;
  status: DotStatus;
  /** Slug del proyecto en data/projects.ts. Si está presente, el dot
   * muestra en hover un mini-card con el hero del proyecto. */
  projectSlug?: string;
}

export interface RegionMapData {
  /** [lat, lng] del centro del mapa en su zoom inicial */
  center: [number, number];
  /** Zoom level de Leaflet (5 = país, 11 = ciudad, 13 = pueblo, 15 = calles) */
  zoom: number;
}

export interface Region {
  slug: string;
  name: string;
  description: Localized<string>;
  projectsCount: number;
  coords: { lat: number; lng: number };
  map: RegionMapData;
  dots: MapDot[];
  gradient: string;
}

/** Ver la nota sobre el snapshot en `./projects`. */
export { regionsSnapshot as regions } from "./content.snapshot";
