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
      image: "/maps/salta.webp",
      // bbox de la provincia entera (la imagen muestra toda Salta, no solo
      // el Valle de Lerma como sugería el spec original)
      bbox: { north: -22, south: -26.5, west: -68.5, east: -62.5 },
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
      // Reutilizamos el mismo mapa de Salta provincia — Cafayate es un
      // departamento del sur de la provincia, así que aparece sobre la
      // misma imagen pero con los dots en la zona inferior.
      image: "/maps/salta.webp",
      // Bbox extendido al sur (hasta -26.9) para empujar los dots de
      // Cafayate al ~84% from top, dentro del departamento Cafayate.
      bbox: { north: -22, south: -26.9, west: -68.5, east: -62.5 },
    },
    // Coords reales de Chaquíes y Mercatus están a ~330m entre sí (ambos
    // en Cafayate ciudad). En la escala de la provincia eso = 0 píxeles
    // de separación → los dots se superponen como uno solo. Acá los
    // separamos artificialmente ~0.05° (similar al spread de los dots de
    // Salta capital) para que se lean como dos puntos distintos. Si en
    // el futuro pasamos a un mapa de zoom de ciudad, restaurar coords reales.
    dots: [
      {
        lat: -26.10,
        lng: -66.00,
        label: "Chaquíes",
        status: "in-progress",
      },
      {
        lat: -26.05,
        lng: -65.94,
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
      image: "/maps/argentina.jpg",
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
