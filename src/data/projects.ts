export type ProjectStatus =
  | "anteproyecto"
  | "en-obra"
  | "lanzamiento"
  | "finalizado";

export interface Project {
  slug: string;
  name: string;
  /** Hashtag oficial del proyecto (ej. #stayinsalta) */
  hashtag?: string;
  /** Claim corto que aparece en el hero del detalle */
  tagline: string;
  /** Descripción para card / página de detalle */
  description: string;
  /** Texto adicional con contexto (para detalle) */
  about?: string;
  location: string;
  region: string;
  status: ProjectStatus;
  statusLabel: string;
  /** Unidades totales (ej. "164 unidades", "22 locales", "26 lotes") */
  units?: string;
  /** Tipologías (ej. "Monoambientes, 1 y 2 dormitorios") */
  tipologias?: string;
  amenities?: string[];
  services?: string[];
  /** Highlights cortos para la card en home (2-3 ítems). */
  highlights: string[];
  /** Texto de inversión / arranque (ej. "Desde USD 45.900") */
  investment?: string;
  /** Hero image — ruta relativa al root (servida desde /public). */
  heroImage: string;
  /** Logo del proyecto — ruta relativa al root. */
  logo?: string;
  brochureUrl?: string;
  /** Avance de obra en YouTube */
  progressUrl?: string;
  /** Embed YouTube para detalle */
  videoEmbed?: string;
  mapsUrl?: string;
  /** Gradient de fallback que se ve mientras carga la imagen. */
  gradient: string;
}

export const projects: Project[] = [
  {
    slug: "greet-balcarce",
    name: "Greet Balcarce",
    hashtag: "#stayinsalta",
    tagline: "Un punto de bienvenida en la ciudad.",
    description:
      "Departamentos de 1, 2 y 3 dormitorios, diseñados para garantizar confort. Además de los pisos de residencias, el edificio cuenta con un SUM en terraza para el disfrute y la convivencia comunitaria.",
    about:
      "Greet es la nueva propuesta de NEOS, la desarrolladora del Grupo SaltaPor. Ubicado estratégicamente en una zona en potencial crecimiento dentro de la ciudad de Salta, se presenta como una gran oportunidad de inversión para quienes buscan una renta simple. Cada inversor de Greet tiene asegurado un ticket bajo de inversión y puede convertirse en verdadero anfitrión de su unidad, con garantía de retorno y bajos costos de mantenimiento.",
    location: "Balcarce, Salta capital",
    region: "Salta Capital",
    status: "anteproyecto",
    statusLabel: "Anteproyecto",
    units: "39 unidades",
    tipologias: "1, 2 y 3 dormitorios + 1 local comercial",
    highlights: [
      "39 unidades · 1 local",
      "SUM en terraza",
      "Zona en crecimiento",
    ],
    heroImage: "/projects/greet-balcarce/hero.webp",
    logo: "/projects/greet-balcarce/logo.png",
    progressUrl:
      "https://www.youtube.com/playlist?list=PLMQAokpPK0kLDMaSxnXC5BPuYReZe6OPN",
    mapsUrl:
      "https://www.google.com/maps/place/24%C2%B046'16.9%22S+65%C2%B024'38.5%22W/@-24.771357,-65.410695,3947m/data=!3m1!1e3!4m4!3m3!8m2!3d-24.7713573!4d-65.4106948",
    gradient: "from-pink-500/40 via-fuchsia-600/30 to-zinc-900",
  },
  {
    slug: "chaquies",
    name: "Chaquíes",
    hashtag: "#stayincafayate",
    tagline: "Cafayate desde una nueva perspectiva.",
    description:
      "Ubicado en el corazón de Cafayate, Chaquíes se encuentra a solo 300 mts de la plaza principal. Cuenta con 164 departamentos y +20.000 m² de desarrollo.",
    location: "Cafayate, Salta",
    region: "Cafayate",
    status: "en-obra",
    statusLabel: "En obra · +50%",
    units: "164 unidades",
    tipologias: "Monoambientes, 1 y 2 dormitorios",
    amenities: [
      "2 Piscinas",
      "Solarium",
      "Spa",
      "Bar",
      "Kids Zone",
      "Kids Zone Cubierto",
      "Cine Aire Libre",
      "SUM",
      "Gimnasio",
      "Yoga",
      "Moto Touring Area",
      "Fogoneros",
    ],
    highlights: [
      "164 unidades · 20.000 m²",
      "12 amenities",
      "A 300 m de la plaza",
    ],
    investment: "En pozo · Anticipo 40% + 36 cuotas",
    heroImage: "/projects/chaquies/hero.webp",
    logo: "/projects/chaquies/logo.png",
    gradient: "from-amber-600/40 via-rose-700/30 to-zinc-900",
  },
  {
    slug: "mercatus",
    name: "Mercatus",
    hashtag: "#mercatus",
    tagline: "Un nuevo lugar para encontrarse en Cafayate.",
    description:
      "Mercatus no es solo un mercado, es un destino. El primer mercado comercial de Cafayate — un lugar pensado para descubrir, disfrutar y conectar con lo mejor de la región.",
    about:
      "Un paseo comercial, un nuevo encuentro, una gran experiencia.",
    location: "Cafayate, Salta",
    region: "Cafayate",
    status: "en-obra",
    statusLabel: "En obra",
    units: "22 locales comerciales",
    highlights: [
      "22 locales comerciales",
      "300 m de la plaza central",
      "Polo gastronómico y cultural",
    ],
    heroImage: "/projects/mercatus/hero.png",
    logo: "/projects/mercatus/logo.png",
    videoEmbed: "https://www.youtube.com/embed/z3i6-MpZCEc",
    gradient: "from-orange-500/40 via-amber-700/30 to-zinc-900",
  },
  {
    slug: "neweken",
    name: "Neweken",
    tagline: "Invertí en renta inmobiliaria en Vaca Muerta con ingresos desde el primer mes.",
    description:
      "Vaca Muerta es una matriz productiva en expansión, con demanda habitacional estructural y sostenida en el tiempo. En ese contexto Neweken: un proyecto inmobiliario pensado para transformar ese crecimiento en renta inmobiliaria real.",
    about:
      "Más de 100 departamentos totalmente equipados, contratos con empresas petroleras multinacionales y un modelo de gestión 100% administrado por NEOS. Vos invertís en un activo productivo, NEOS gestiona, vos percibís la renta.",
    location: "Añelo, Vaca Muerta · Neuquén",
    region: "Vaca Muerta",
    status: "en-obra",
    statusLabel: "En obra",
    units: "+100 departamentos",
    tipologias: "Equipados y administrados",
    highlights: [
      "Desde USD 45.900",
      "Renta desde el primer mes",
      "Gestión 100% NEOS",
    ],
    investment: "Desde USD 45.900",
    heroImage: "/projects/neweken/hero.png",
    logo: "/projects/neweken/logo.png",
    gradient: "from-emerald-600/40 via-teal-700/30 to-zinc-900",
  },
  {
    slug: "el-cauce-castellanos",
    name: "El Cauce Castellanos",
    hashtag: "#elcauce",
    tagline: "Un hogar con encanto natural.",
    description:
      "Un barrio privado ubicado en Castellanos, San Lorenzo. 26 lotes exclusivos desde 800 m² con todos los servicios para vivir conectado con la naturaleza.",
    location: "Castellanos, San Lorenzo · Salta",
    region: "Salta Capital",
    status: "en-obra",
    statusLabel: "En obra",
    units: "26 lotes",
    tipologias: "Desde 800 m² exclusivos",
    amenities: [
      "Parque central",
      "Espejo de agua",
      "Caminerías internas",
      "Salón usos múltiples",
      "Gym equipado",
      "Juegos de niños",
      "Fogoneros",
    ],
    services: [
      "Acceso con seguridad",
      "Servicios soterrados",
      "Iluminación LED",
      "Calles asfaltadas",
      "Tratamiento integral de residuos",
      "Agua · Luz · Gas",
    ],
    highlights: [
      "26 lotes · desde 800 m²",
      "Todos los servicios",
      "Barrio privado",
    ],
    heroImage: "/projects/el-cauce-castellanos/hero.webp",
    logo: "/projects/el-cauce-castellanos/logo.png",
    gradient: "from-sky-600/40 via-emerald-700/30 to-zinc-900",
  },
];
