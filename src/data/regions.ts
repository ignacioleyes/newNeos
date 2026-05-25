import type { Localized } from "../i18n/types";

export type DotStatus = "in-progress" | "finalized";

export interface MapDot {
  lat: number;
  lng: number;
  label: string;
  status: DotStatus;
}

export interface RegionMapData {
  image: string | null;
  bbox: { north: number; south: number; east: number; west: number };
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
      image: "/maps/salta.png",
      bbox: { north: -24.4, south: -25.2, west: -65.7, east: -64.8 },
    },
    dots: [
      {
        lat: -24.7821,
        lng: -65.4106,
        label: "Greet Balcarce",
        status: "in-progress",
      },
      {
        lat: -24.7178,
        lng: -65.5022,
        label: "El Cauce Castellanos",
        status: "in-progress",
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
      image: "/maps/cafayate.png",
      bbox: { north: -26.05, south: -26.1, west: -66.0, east: -65.93 },
    },
    dots: [
      {
        lat: -26.0744,
        lng: -65.9741,
        label: "Chaquíes",
        status: "in-progress",
      },
      {
        lat: -26.0712,
        lng: -65.9722,
        label: "Mercatus",
        status: "in-progress",
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
      image: "/maps/argentina.png",
      bbox: { north: -21.5, south: -55.5, west: -74, east: -52 },
    },
    dots: [
      {
        lat: -38.3556,
        lng: -68.7864,
        label: "Neweken — Añelo",
        status: "in-progress",
      },
    ],
    gradient: "from-fuchsia-700/30 to-zinc-900",
  },
];
