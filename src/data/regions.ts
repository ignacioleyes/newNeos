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

export const regions: Region[] = [
  {
    slug: "salta-capital",
    name: "Salta Capital",
    description: {
      es: "Residencial premium y barrios privados en el Valle de Lerma.",
      en: "Premium residential and gated communities in the Lerma Valley.",
    },
    projectsCount: 2,
    coords: { lat: -24.78, lng: -65.41 },
    map: {
      center: [-24.78, -65.41],
      zoom: 11, // Área del Valle de Lerma (Salta capital + alrededores)
    },
    dots: [
      {
        lat: -24.7821,
        lng: -65.4106,
        label: "Greet Balcarce",
        status: "in-progress",
        projectSlug: "greet-balcarce",
      },
      {
        lat: -24.7178,
        lng: -65.5022,
        label: "El Cauce Castellanos",
        status: "in-progress",
        projectSlug: "el-cauce-castellanos",
      },
    ],
    gradient: "from-rose-600/30 to-zinc-900",
  },
  {
    slug: "cafayate",
    name: "Cafayate",
    description: {
      es: "Lifestyle, turismo y vino entre montañas.",
      en: "Lifestyle, tourism and wine between mountains.",
    },
    projectsCount: 2,
    coords: { lat: -26.07, lng: -65.97 },
    map: {
      center: [-26.075, -65.972],
      zoom: 14, // Pueblo de Cafayate (zoom de calles)
    },
    // Coords reales — Chaquíes y Mercatus están a ~330m en Cafayate ciudad.
    // Con zoom 14 se ven como dos dots distintos sin necesidad de spread artificial.
    dots: [
      {
        lat: -26.0744,
        lng: -65.9741,
        label: "Chaquíes",
        status: "in-progress",
        projectSlug: "chaquies",
      },
      {
        lat: -26.0712,
        lng: -65.9722,
        label: "Mercatus",
        status: "in-progress",
        projectSlug: "mercatus",
      },
    ],
    gradient: "from-amber-600/30 to-zinc-900",
  },
  {
    slug: "vaca-muerta",
    name: "Vaca Muerta",
    description: {
      es: "Vivienda al servicio del polo energético.",
      en: "Housing serving the energy hub.",
    },
    projectsCount: 1,
    coords: { lat: -38.36, lng: -68.78 },
    map: {
      center: [-38.36, -68.78],
      zoom: 7, // Norte de la Patagonia (Neuquén + Río Negro)
    },
    dots: [
      {
        lat: -38.3556,
        lng: -68.7864,
        label: "Neweken — Añelo",
        status: "in-progress",
        projectSlug: "neweken",
      },
    ],
    gradient: "from-fuchsia-700/30 to-zinc-900",
  },
];
