export interface Region {
  slug: string;
  name: string;
  description: string;
  projectsCount: number;
  gradient: string;
}

export const regions: Region[] = [
  {
    slug: "salta-capital",
    name: "Salta Capital",
    description: "Residencial premium y barrios privados en el Valle de Lerma.",
    projectsCount: 2,
    gradient: "from-rose-600/30 to-zinc-900",
  },
  {
    slug: "cafayate",
    name: "Cafayate",
    description: "Lifestyle, turismo y vino entre montañas.",
    projectsCount: 2,
    gradient: "from-amber-600/30 to-zinc-900",
  },
  {
    slug: "vaca-muerta",
    name: "Vaca Muerta",
    description: "Vivienda al servicio del polo energético.",
    projectsCount: 1,
    gradient: "from-fuchsia-700/30 to-zinc-900",
  },
  {
    slug: "cabra-corral",
    name: "Dique Cabra Corral",
    description: "Naturaleza protegida y segunda residencia.",
    projectsCount: 0,
    gradient: "from-emerald-600/30 to-zinc-900",
  },
  {
    slug: "san-antonio-de-los-cobres",
    name: "San Antonio de los Cobres",
    description: "Altura, paisaje extremo, oportunidades únicas.",
    projectsCount: 0,
    gradient: "from-sky-600/30 to-zinc-900",
  },
];
