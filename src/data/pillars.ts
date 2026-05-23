export interface Pillar {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  description: string;
}

/**
 * Métricas provisionales. Validar/reemplazar con datos reales de NEOS antes de publicar.
 */
export const pillars: Pillar[] = [
  {
    prefix: "+",
    value: 15,
    label: "años de trayectoria",
    description: "Construyendo proyectos que trascienden.",
  },
  {
    prefix: "+",
    value: 50000,
    suffix: " m²",
    label: "desarrollados",
    description: "Entre Salta, Cafayate, Vaca Muerta y más.",
  },
  {
    prefix: "+",
    value: 500,
    label: "unidades entregadas",
    description: "Familias e inversores que ya confiaron.",
  },
  {
    value: 3,
    label: "regiones activas",
    description: "Norte argentino y Patagonia energética.",
  },
];
