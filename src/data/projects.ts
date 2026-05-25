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
}

const inProgress: Localized<string> = { es: "En obra", en: "Under construction" };

export const projects: Project[] = [
  {
    slug: "chaquies",
    name: "Chaquíes",
    hashtag: "#stayincafayate",
    tagline: {
      es: "Cafayate desde una nueva perspectiva.",
      en: "Cafayate from a new perspective.",
    },
    description: {
      es: "Ubicado en el corazón de Cafayate, Chaquíes se encuentra a solo 300 mts de la plaza principal. Cuenta con 164 departamentos y +20.000 m² de desarrollo.",
      en: "Located in the heart of Cafayate, Chaquíes sits just 300 m from the main square. It comprises 164 apartments and over 20,000 m² of development.",
    },
    location: { es: "Cafayate, Salta", en: "Cafayate, Salta" },
    region: "Cafayate",
    status: "en-obra",
    statusLabel: inProgress,
    units: { es: "164 unidades", en: "164 units" },
    tipologias: {
      es: "Monoambientes, 1 y 2 dormitorios",
      en: "Studios, 1 and 2-bedroom apartments",
    },
    amenities: [
      { key: "2 piscinas", label: { es: "2 Piscinas", en: "2 Pools" } },
      {
        key: "piscina int. climatizada",
        label: { es: "Piscina Int. Climatizada", en: "Indoor Heated Pool" },
      },
      { key: "solarium", label: { es: "Solarium", en: "Solarium" } },
      { key: "spa", label: { es: "Spa", en: "Spa" } },
      { key: "bar", label: { es: "Bar", en: "Bar" } },
      { key: "kids zone", label: { es: "Kids Zone", en: "Kids Zone" } },
      {
        key: "kids zone cubierto",
        label: { es: "Kids Zone Cubierto", en: "Indoor Kids Zone" },
      },
      {
        key: "cine aire libre",
        label: { es: "Cine Aire Libre", en: "Outdoor Cinema" },
      },
      { key: "sum", label: { es: "SUM", en: "Multipurpose Room" } },
      { key: "gimnasio", label: { es: "Gimnasio", en: "Gym" } },
      { key: "yoga", label: { es: "Yoga", en: "Yoga" } },
      {
        key: "moto touring area",
        label: { es: "Moto Touring Area", en: "Moto Touring Area" },
      },
      { key: "fogoneros", label: { es: "Fogoneros", en: "Fire Pits" } },
    ],
    highlights: {
      es: [
        "164 unidades · 20.000 m²",
        "13 amenities",
        "A 300 m de la plaza",
      ],
      en: [
        "164 units · 20,000 m²",
        "13 amenities",
        "300 m from the square",
      ],
    },
    investment: {
      es: "En pozo · Anticipo 40% + 24 cuotas",
      en: "Pre-construction · 40% down + 24 installments",
    },
    heroImage: "/projects/chaquies/newHero.jpg",
    logo: "/projects/chaquies/logo.png",
    gradient: "from-amber-600/40 via-rose-700/30 to-zinc-900",
  },
  {
    slug: "greet-balcarce",
    name: "Greet Balcarce",
    hashtag: "#stayinsalta",
    tagline: {
      es: "Un punto de bienvenida en la ciudad.",
      en: "A welcoming spot in the city.",
    },
    description: {
      es: "Departamentos de 1, 2 y 3 dormitorios, diseñados para garantizar confort. Además de los pisos de residencias, el edificio cuenta con un SUM en terraza para el disfrute y la convivencia comunitaria.",
      en: "1, 2 and 3-bedroom apartments designed for comfort. In addition to the residential floors, the building features a rooftop SUM for enjoyment and community.",
    },
    about: {
      es: "Greet es la nueva propuesta de NEOS, la desarrolladora del Grupo SaltaPor. Ubicado estratégicamente en una zona en potencial crecimiento dentro de la ciudad de Salta, se presenta como una gran oportunidad de inversión para quienes buscan una renta simple. Cada inversor de Greet tiene asegurado un ticket bajo de inversión y puede convertirse en verdadero anfitrión de su unidad, con garantía de retorno y bajos costos de mantenimiento.",
      en: "Greet is the newest proposal from NEOS, the developer of Grupo SaltaPor. Strategically located in a high-potential growth area within the city of Salta, it stands out as a great investment opportunity for those seeking a simple income stream. Every Greet investor benefits from a low entry ticket and can become a true host of their unit, with guaranteed returns and low maintenance costs.",
    },
    location: {
      es: "Balcarce, Salta capital",
      en: "Balcarce, Salta capital",
    },
    region: "Salta Capital",
    status: "en-obra",
    statusLabel: inProgress,
    units: { es: "39 unidades", en: "39 units" },
    tipologias: {
      es: "1, 2 y 3 dormitorios + 1 local comercial",
      en: "1, 2 and 3-bedroom + 1 commercial unit",
    },
    highlights: {
      es: [
        "39 unidades · 1 local",
        "SUM en terraza",
        "Zona en crecimiento",
      ],
      en: [
        "39 units · 1 commercial",
        "Rooftop SUM",
        "Growing area",
      ],
    },
    heroImage: "/projects/greet-balcarce/hero.webp",
    logo: "/projects/greet-balcarce/logo.png",
    progressUrl:
      "https://www.youtube.com/playlist?list=PLMQAokpPK0kLDMaSxnXC5BPuYReZe6OPN",
    mapsUrl:
      "https://www.google.com/maps/place/24%C2%B046'16.9%22S+65%C2%B024'38.5%22W/@-24.771357,-65.410695,3947m/data=!3m1!1e3!4m4!3m3!8m2!3d-24.7713573!4d-65.4106948",
    gradient: "from-pink-500/40 via-fuchsia-600/30 to-zinc-900",
  },
  {
    slug: "mercatus",
    name: "Mercatus",
    hashtag: "#mercatus",
    tagline: {
      es: "Un nuevo lugar para encontrarse en Cafayate.",
      en: "A new place to meet in Cafayate.",
    },
    description: {
      es: "Mercatus no es solo un mercado, es un destino. El primer mercado comercial de Cafayate — un lugar pensado para descubrir, disfrutar y conectar con lo mejor de la región.",
      en: "Mercatus isn't just a market — it's a destination. Cafayate's first commercial market, designed to discover, enjoy and connect with the best of the region.",
    },
    about: {
      es: "Un paseo comercial, un nuevo encuentro, una gran experiencia.",
      en: "A retail walk, a new gathering spot, a great experience.",
    },
    location: { es: "Cafayate, Salta", en: "Cafayate, Salta" },
    region: "Cafayate",
    status: "en-obra",
    statusLabel: inProgress,
    units: {
      es: "22 locales comerciales",
      en: "22 commercial units",
    },
    highlights: {
      es: [
        "22 locales comerciales",
        "300 m de la plaza central",
        "Polo gastronómico y cultural",
      ],
      en: [
        "22 commercial units",
        "300 m from the main square",
        "Gastronomic and cultural hub",
      ],
    },
    heroImage: "/projects/mercatus/hero.png",
    logo: "/projects/mercatus/logo.png",
    videoEmbed: "https://www.youtube.com/embed/z3i6-MpZCEc",
    gradient: "from-orange-500/40 via-amber-700/30 to-zinc-900",
  },
  {
    slug: "neweken",
    name: "Neweken",
    tagline: {
      es: "Invertí en renta inmobiliaria en Vaca Muerta con ingresos desde el primer mes.",
      en: "Invest in real-estate income in Vaca Muerta with returns from month one.",
    },
    description: {
      es: "Vaca Muerta es una matriz productiva en expansión, con demanda habitacional estructural y sostenida en el tiempo. En ese contexto Neweken: un proyecto inmobiliario pensado para transformar ese crecimiento en renta inmobiliaria real.",
      en: "Vaca Muerta is an expanding productive engine with structural and sustained housing demand. In that context: Neweken, a real-estate project designed to turn that growth into real income.",
    },
    about: {
      es: "Más de 100 departamentos totalmente equipados, contratos con empresas petroleras multinacionales y un modelo de gestión 100% administrado por NEOS. Vos invertís en un activo productivo, NEOS gestiona, vos percibís la renta.",
      en: "More than 100 fully equipped apartments, contracts with multinational oil companies and a management model 100% run by NEOS. You invest in a productive asset, NEOS manages, you collect the income.",
    },
    location: {
      es: "Añelo, Vaca Muerta · Neuquén",
      en: "Añelo, Vaca Muerta · Neuquén",
    },
    region: "Vaca Muerta",
    status: "en-obra",
    statusLabel: inProgress,
    units: { es: "+100 departamentos", en: "+100 apartments" },
    tipologias: {
      es: "Equipados y administrados",
      en: "Equipped and managed",
    },
    highlights: {
      es: [
        "Desde USD 45.900",
        "Renta desde el primer mes",
        "Gestión 100% NEOS",
      ],
      en: [
        "From USD 45,900",
        "Income from month one",
        "100% NEOS management",
      ],
    },
    investment: {
      es: "Desde USD 45.900",
      en: "From USD 45,900",
    },
    heroImage: "/projects/neweken/hero.png",
    logo: "/projects/neweken/logo.png",
    gradient: "from-emerald-600/40 via-teal-700/30 to-zinc-900",
  },
  {
    slug: "el-cauce-castellanos",
    name: "El Cauce Castellanos",
    hashtag: "#elcauce",
    tagline: {
      es: "Un hogar con encanto natural.",
      en: "A home with natural charm.",
    },
    description: {
      es: "Un barrio privado ubicado en Castellanos, San Lorenzo. 26 lotes exclusivos desde 800 m² con todos los servicios para vivir conectado con la naturaleza.",
      en: "A gated community in Castellanos, San Lorenzo. 26 exclusive lots from 800 m² with all services to live connected to nature.",
    },
    location: {
      es: "Castellanos, San Lorenzo · Salta",
      en: "Castellanos, San Lorenzo · Salta",
    },
    region: "Salta Capital",
    status: "en-obra",
    statusLabel: inProgress,
    units: { es: "26 lotes", en: "26 lots" },
    tipologias: {
      es: "Desde 800 m² exclusivos",
      en: "From 800 m² exclusive",
    },
    amenities: [
      {
        key: "parque central",
        label: { es: "Parque central", en: "Central park" },
      },
      {
        key: "espejo de agua",
        label: { es: "Espejo de agua", en: "Reflecting pool" },
      },
      {
        key: "caminerias internas",
        label: { es: "Caminerías internas", en: "Internal walkways" },
      },
      {
        key: "salon usos multiples",
        label: { es: "Salón usos múltiples", en: "Multipurpose room" },
      },
      {
        key: "gym equipado",
        label: { es: "Gym equipado", en: "Equipped gym" },
      },
      {
        key: "juegos de ninos",
        label: { es: "Juegos de niños", en: "Children's play area" },
      },
      { key: "fogoneros", label: { es: "Fogoneros", en: "Fire pits" } },
    ],
    services: {
      es: [
        "Acceso con seguridad",
        "Servicios soterrados",
        "Iluminación LED",
        "Calles asfaltadas",
        "Tratamiento integral de residuos",
        "Agua · Luz · Gas",
      ],
      en: [
        "Secure access",
        "Underground utilities",
        "LED lighting",
        "Paved streets",
        "Integral waste management",
        "Water · Electricity · Gas",
      ],
    },
    highlights: {
      es: [
        "26 lotes · desde 800 m²",
        "Todos los servicios",
        "Barrio privado",
      ],
      en: [
        "26 lots · from 800 m²",
        "All services",
        "Gated community",
      ],
    },
    heroImage: "/projects/el-cauce-castellanos/hero.webp",
    logo: "/projects/el-cauce-castellanos/logo.png",
    gradient: "from-sky-600/40 via-emerald-700/30 to-zinc-900",
  },
];
