import type { Localized } from "../i18n/types";

export interface Pillar {
  prefix?: string;
  value: number;
  suffix?: string;
  label: Localized<string>;
  description: Localized<string>;
}

export const pillars: Pillar[] = [
  {
    prefix: "+",
    value: 15,
    label: { es: "años de trayectoria", en: "years of experience" },
    description: {
      es: "Construyendo proyectos que trascienden.",
      en: "Building projects that transcend.",
    },
  },
  {
    prefix: "+",
    value: 50000,
    suffix: " m²",
    label: { es: "desarrollados", en: "developed" },
    description: {
      es: "Entre Salta, Cafayate, Vaca Muerta y más.",
      en: "Across Salta, Cafayate, Vaca Muerta and more.",
    },
  },
  {
    prefix: "+",
    value: 500,
    label: { es: "unidades entregadas", en: "delivered units" },
    description: {
      es: "Familias e inversores que ya confiaron.",
      en: "Families and investors that already trusted us.",
    },
  },
  {
    value: 3,
    label: { es: "regiones activas", en: "active regions" },
    description: {
      es: "Norte argentino y Patagonia energética.",
      en: "Northern Argentina and energy Patagonia.",
    },
  },
];
