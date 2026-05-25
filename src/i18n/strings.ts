import type { Lang } from "./types";

/**
 * UI strings dictionary. Use `t("section.key")` from useT() to read.
 * Keep the ES and EN trees in sync.
 */
export const messages = {
  es: {
    common: {
      menu: "Menú",
      close: "Cerrar",
      open: "Abrir menú",
      language: "Idioma",
      languageShort: "ES",
      backToHome: "← Volver al inicio",
      backToProjects: "← Volver a proyectos",
      contactCta: "Solicitar info",
      learnMore: "Conocer más",
      viewProject: "Ver proyecto →",
      seeOnMap: "Ver en el mapa",
      whatsapp: "WhatsApp",
      email: "Email",
      office: "Oficina",
      phone: "Teléfono",
      address: "Leguizamón 1946 · Salta · Argentina",
      inProgress: "En obra",
      delivered: "Entregado",
    },
    nav: {
      navigation: "Navegación",
      home: "Inicio",
      projects: "Proyectos",
      about: "Nosotros",
      contact: "Contacto",
      connect: "Conectá",
    },
    hero: {
      eyebrow: "Desarrolladora del Grupo SaltaPor",
      titleA: "Oportunidades",
      titleB: "que se",
      titleHighlight: "concretan.",
      subtitle:
        "Diseñamos, construimos y comercializamos proyectos inmobiliarios pensados para vivir e invertir mejor. De Salta a Vaca Muerta.",
      ctaPrimary: "Ver proyectos",
      ctaSecondary: "Hablar con un asesor",
      scroll: "scroll",
    },
    pillars: {},
    projects: {
      eyebrow: "Portfolio activo",
      titleA: "Proyectos que",
      titleHighlight: "trascienden",
      titleB: ".",
      subtitle:
        "Cada desarrollo es una lectura del territorio: ubicación, escala humana, diseño y rentabilidad pensados en conjunto.",
      specUnits: "Unidades",
      specTipology: "Tipología",
      specAmenities: "Amenities",
      specInvestment: "Inversión",
      amenitiesCount: (n: number) => `${n} amenities`,
    },
    regions: {
      eyebrow: "Dónde construimos",
      titleA: "Distintas regiones, una",
      titleHighlight: "misma lectura",
      titleB: "del territorio.",
      projectsCount: (n: number) =>
        n === 1 ? "1 proyecto" : `${n} proyectos`,
      comingSoon: "Próximamente",
    },
    about: {
      eyebrow: "Quiénes somos",
      titleA: "Una desarrolladora que",
      titleHighlight: "construye futuro",
      titleB: "en cada región.",
      body1:
        "NEOS es la desarrolladora del Grupo SaltaPor. Diseñamos productos inmobiliarios pensando en ubicación, escala humana, diseño y rentabilidad — para que vivir, descansar e invertir sean parte de la misma decisión.",
      body2:
        "Operamos desde Salta capital hasta Vaca Muerta, leyendo cada territorio para transformar potencial regional en oportunidades que se concretan.",
      pill1Label: "Diseño",
      pill1Value: "Arquitectura contemporánea",
      pill2Label: "Respaldo",
      pill2Value: "Grupo SaltaPor",
      pill3Label: "Foco",
      pill3Value: "Inversión + lifestyle",
    },
    brochure: {
      eyebrow: "Material institucional",
      title: "Descargá el portfolio NEOS.",
      body: "Brochure consolidado con todos los proyectos, plantas y datos de inversión.",
      cta: "Solicitar brochure →",
    },
    contact: {
      eyebrow: "Conversemos",
      titleA: "Tu próxima",
      titleHighlight: "oportunidad",
      titleB: ", a un mensaje.",
      subtitle:
        "Dejanos tus datos y un asesor de NEOS te contacta para mostrarte el proyecto que mejor se adapta a tu inversión o estilo de vida.",
      fName: "Nombre",
      fEmail: "E-mail",
      fPhone: "Teléfono",
      fMessage: "Mensaje",
      fMessageOptional: "(opcional)",
      submit: "Enviar consulta →",
      submitting: "Enviando…",
      submitted: "¡Recibido! Te escribimos pronto ✓",
      error: "Algo falló al enviar. Probá de nuevo en un momento.",
      disclaimer: "Al enviar aceptás ser contactado por un asesor de NEOS.",
    },
    footer: {
      blurb: "Desarrolladora del Grupo SaltaPor. Oportunidades que se concretan.",
      contactHeading: "Contacto",
      projectsHeading: "Proyectos",
      copyright: (year: number) =>
        `© ${year} NEOS · Grupo SaltaPor. Todos los derechos reservados.`,
      tagline: "Hecho con cariño desde el norte argentino.",
    },
    comingSoon: {
      pageInConstruction: "Página de detalle en construcción",
    },
    project: {
      seeProgress: "Ver avance de obra",
      requestInfo: "Solicitar info",
      whatIs: (name: string) => `¿Qué es ${name}?`,
      location: "Ubicación",
      units: "Unidades",
      tipology: "Tipología",
      investFrom: "Inversión desde",
      distanceToSquare: "Distancia a la plaza",
      amenities: "Amenities",
      amenitiesTitle: "Amenities para",
      amenitiesHighlight: "vivir y rentabilizar",
      amenitiesEnd: ".",
      renders: "Renders del proyecto",
      gallery: "El proyecto en imágenes.",
      progressOfWork: "Avance de obra",
      masterplan: "Master plan",
      stages: "Etapas",
      plans: "Plantas",
      plansBody: "Solicitalas por mail →",
      brochure: "Brochure",
      brochureBody: "Material completo del proyecto →",
      progressBody: "Master plan + galería →",
      seeAmenities: "Ver amenities",
      seeAmenitiesBody: "Ver los 13 amenities →",
      // Chaquíes-specific
      chaquies: {
        whatTitleA: "Más de",
        whatHighlight: "20.000 m²",
        whatTitleB: "de desarrollo en el corazón de Cafayate.",
        whatBody1:
          "Chaquíes integra 164 unidades de monoambientes, 1 y 2 dormitorios con un masterplan de 13 amenities pensados para vivir, descansar y rentabilizar.",
        whatBody2:
          "A 300 metros de la plaza principal, conjuga ubicación privilegiada, escala arquitectónica y un programa de servicios que define un nuevo estándar para Cafayate.",
        metricUnits: "unidades",
        metricM2: "m² desarrollados",
        metricAmenities: "amenities",
        contextEyebrow: "El contexto",
        contextTitleA: "¿Por qué invertir hoy en",
        contextHighlight: "Cafayate",
        contextTitleB: "?",
        contextSubtitle:
          "Una de las plazas turísticas que más crece en el norte argentino — ubicación, escasez de oferta premium y demanda sostenida.",
        reason1Eyebrow: "Destino turístico consolidado",
        reason1Title: "Vino, montañas y patrimonio",
        reason1Body:
          "Cafayate combina paisaje de altura, bodegas reconocidas y un casco histórico vivo. Un destino que crece año tras año en ocupación y derrame turístico.",
        reason2Eyebrow: "Demanda de alojamiento permanente",
        reason2Title: "Turismo + segunda residencia",
        reason2Body:
          "Una plaza donde la oferta de departamentos premium aún es escasa frente a una demanda creciente — alquiler temporario, fines de semana largos y temporada alta.",
        reason3Eyebrow: "Ubicación estratégica",
        reason3Title: "300 metros de la plaza principal",
        reason3Body:
          "El corazón de Cafayate: caminás a bodegas, restaurantes y la vida del pueblo. Una ubicación que no se repite y define el valor en el tiempo.",
        pullQuoteA:
          "Una ubicación a metros de la plaza, una arquitectura pensada para el descanso y un programa de amenities que",
        pullQuoteHighlight: "redefine el estándar de Cafayate",
        pullQuoteB: ".",
        investEyebrow: "Invertí en pozo",
        investPart1: "Anticipo",
        investPart2: " + 24 cuotas",
        investBody:
          "Una estructura de financiación pensada para inversores que buscan capturar el valor de Cafayate antes de la entrega.",
      },
      // Neweken-specific
      neweken: {
        whatEyebrow: "¿Qué es Neweken?",
        whatTitleA: "Un proyecto pensado para transformar el",
        whatHighlight: "crecimiento energético",
        whatTitleB: "en renta inmobiliaria real.",
        metric1Value: "+100",
        metric1Label: "departamentos equipados",
        metric2Value: "100%",
        metric2Label: "gestionado por NEOS",
        metric3Value: "1er mes",
        metric3Label: "comenzás a percibir renta",
        contextEyebrow: "El contexto",
        contextTitleA: "¿Por qué invertir hoy en",
        contextHighlight: "Vaca Muerta",
        contextTitleB: "?",
        contextSubtitle:
          "El principal motor de crecimiento económico de la Argentina en la próxima década — y una de las oportunidades inmobiliarias más sólidas del mercado actual.",
        reason1Eyebrow: "Oportunidad de escala global",
        reason1Title: "Inversiones extranjeras comprometidas",
        reason1Body:
          "Vaca Muerta proyecta exportaciones por más de USD 50.000 millones a 2030 — capital, estabilidad y continuidad operativa garantizadas por las principales energéticas del mundo.",
        reason2Eyebrow: "Demanda habitacional permanente",
        reason2Title: "Perfiles técnicos y profesionales",
        reason2Body:
          "El crecimiento sostenido de la actividad energética implica una demanda habitacional estructural de perfiles técnicos y operativos, con proyecciones de empleo crecientes entre 2025 y 2030.",
        reason3Eyebrow: "Crecimiento demográfico acelerado",
        reason3Title: "Añelo: de 7.000 a 30.000 habitantes",
        reason3Body:
          "Centro operativo de Vaca Muerta. La presión habitacional genera condiciones ideales para inversiones rentables, alta ocupación y valorización constante del capital.",
        pullEyebrow: "El momento es ahora",
        pullA:
          "La infraestructura energética avanza más rápido que el desarrollo urbano. Quienes invierten hoy lo hacen",
        pullHighlight:
          "antes de que la brecha entre oferta y demanda se cierre",
        pullB: ", capturando los mayores márgenes de rentabilidad.",
        masterEyebrow: "Master plan",
        masterTitleA: "6 etapas.",
        masterHighlight: "4 entregadas, 2 en obra.",
        stageFinished: "Finalizada y en funcionamiento",
        stageInProgress: "En obra",
        investEyebrow: "Inversión",
        investFromLabel: "Desde",
        investBody:
          "Accedé a Vaca Muerta con un ticket bajo y una estructura pensada para inversores que buscan rentabilidad, previsibilidad y gestión profesional.",
      },
    },
    neo: {
      fab: {
        label: "Hablá con Neo",
        proactiveTooltip: "Hola, soy Neo. ¿Te ayudo?",
      },
      header: {
        title: "Neo",
        subtitle: "Asistente NEOS",
        closeLabel: "Cerrar conversación",
      },
      steps: {
        discover_intent: {
          text: "¡Hola! Soy Neo, el asistente de NEOS. Te ayudo a explorar nuestros proyectos. ¿Qué te interesa hacer?",
          choices: {
            inversion: "Quiero invertir",
            vivienda: "Buscar vivienda",
            info: "Solo info",
          },
        },
        discover_region: {
          text: "Genial. ¿Tenés alguna zona en mente?",
          choices: {
            "cafayate": "Cafayate",
            "vaca-muerta": "Vaca Muerta",
            "salta-capital": "Salta Capital",
            "otro": "Aún no sé",
          },
        },
        show_projects: {
          text: (region: string) =>
            `Estos son los proyectos que tenemos en ${region}. Mirá los que te interesen y seguimos.`,
          textNoRegion:
            "Te muestro algunos de nuestros proyectos. Mirá los que te interesen y seguimos.",
          continue: "Continuar",
          viewProject: "Ver proyecto →",
        },
        capture_name: {
          text: "Para que un asesor te mande info personalizada, ¿cómo te llamás?",
          placeholder: "Tu nombre",
          submit: "Continuar",
          errorMin: "Ingresá tu nombre completo",
        },
        capture_contact_channel: {
          text: (name: string) =>
            `Listo, ${name}. ¿Por dónde preferís que te contactemos?`,
          choices: {
            email: "Por email",
            phone: "Por WhatsApp",
          },
        },
        capture_contact_value: {
          textEmail: "Genial. ¿Cuál es tu email?",
          textPhone: "Genial. ¿Cuál es tu número de WhatsApp?",
          placeholderEmail: "tu@email.com",
          placeholderPhone: "+54 9 387 123 4567",
          submit: "Continuar",
          errorEmail: "Ese email no parece válido",
          errorPhone: "Ese número no parece válido",
        },
        confirm: {
          text: (name: string) =>
            `Perfecto, ${name}. ¿Confirmamos estos datos para que un asesor te contacte?`,
          labelName: "Nombre",
          labelEmail: "Email",
          labelPhone: "WhatsApp",
          labelInterest: "Interés",
          labelRegion: "Zona",
          labelProject: "Proyecto",
          confirm: "Confirmar y enviar",
          edit: "Editar datos",
        },
        post_send: {
          text: (name: string) =>
            `¡Listo, ${name}! Un asesor de NEOS te va a contactar a la brevedad. ¿Querés además escribirnos por WhatsApp ahora?`,
          whatsapp: "Abrir WhatsApp",
          noThanks: "Después, gracias",
          whatsappPrefill: (
            name: string,
            interest: string | null,
            region: string | null,
          ) => {
            const parts = [`Hola, soy ${name}. Hablé con Neo en la web`];
            if (interest) parts.push(`y me interesa ${interest.toLowerCase()}`);
            if (region) parts.push(`en ${region}`);
            return parts.join(" ") + ".";
          },
        },
        closed: {
          text: "¡Gracias por hablar con Neo! Cuando quieras, abrí el chat de nuevo.",
          restart: "Empezar de nuevo",
        },
      },
      display: {
        interest: {
          inversion: "Inversión",
          vivienda: "Vivienda",
          info: "Solo info",
        },
        region: {
          "cafayate": "Cafayate",
          "vaca-muerta": "Vaca Muerta",
          "salta-capital": "Salta Capital",
          "otro": "Aún no sé",
        },
      },
      send: {
        sending: "Enviando…",
        error: "Algo falló al enviar. Probá de nuevo.",
        retry: "Reintentar",
      },
    },
  },
  en: {
    common: {
      menu: "Menu",
      close: "Close",
      open: "Open menu",
      language: "Language",
      languageShort: "EN",
      backToHome: "← Back to home",
      backToProjects: "← Back to projects",
      contactCta: "Request info",
      learnMore: "Learn more",
      viewProject: "View project →",
      seeOnMap: "View on map",
      whatsapp: "WhatsApp",
      email: "Email",
      office: "Office",
      phone: "Phone",
      address: "Leguizamón 1946 · Salta · Argentina",
      inProgress: "Under construction",
      delivered: "Delivered",
    },
    nav: {
      navigation: "Navigation",
      home: "Home",
      projects: "Projects",
      about: "About",
      contact: "Contact",
      connect: "Connect",
    },
    hero: {
      eyebrow: "Real-estate arm of Grupo SaltaPor",
      titleA: "Opportunities",
      titleB: "that",
      titleHighlight: "deliver.",
      subtitle:
        "We design, build and sell real-estate projects made for better living and smarter investing. From Salta to Vaca Muerta.",
      ctaPrimary: "See projects",
      ctaSecondary: "Talk to an advisor",
      scroll: "scroll",
    },
    pillars: {},
    projects: {
      eyebrow: "Active portfolio",
      titleA: "Projects that",
      titleHighlight: "transcend",
      titleB: ".",
      subtitle:
        "Every development is a reading of its territory: location, human scale, design and returns thought through together.",
      specUnits: "Units",
      specTipology: "Typology",
      specAmenities: "Amenities",
      specInvestment: "Investment",
      amenitiesCount: (n: number) => `${n} amenities`,
    },
    regions: {
      eyebrow: "Where we build",
      titleA: "Different regions, one",
      titleHighlight: "consistent reading",
      titleB: "of the territory.",
      projectsCount: (n: number) =>
        n === 1 ? "1 project" : `${n} projects`,
      comingSoon: "Coming soon",
    },
    about: {
      eyebrow: "About us",
      titleA: "A developer that",
      titleHighlight: "builds the future",
      titleB: "in every region.",
      body1:
        "NEOS is the real-estate developer of Grupo SaltaPor. We design real-estate products around location, human scale, design and returns — so that living, vacationing and investing are part of the same decision.",
      body2:
        "We operate from Salta capital to Vaca Muerta, reading every territory to turn regional potential into opportunities that deliver.",
      pill1Label: "Design",
      pill1Value: "Contemporary architecture",
      pill2Label: "Backing",
      pill2Value: "Grupo SaltaPor",
      pill3Label: "Focus",
      pill3Value: "Investment + lifestyle",
    },
    brochure: {
      eyebrow: "Corporate material",
      title: "Download the NEOS portfolio.",
      body: "Consolidated brochure with every project, floor plan and investment data.",
      cta: "Request brochure →",
    },
    contact: {
      eyebrow: "Let's talk",
      titleA: "Your next",
      titleHighlight: "opportunity",
      titleB: ", one message away.",
      subtitle:
        "Leave us your details and a NEOS advisor will reach out to show you the project that best fits your investment or lifestyle.",
      fName: "Name",
      fEmail: "E-mail",
      fPhone: "Phone",
      fMessage: "Message",
      fMessageOptional: "(optional)",
      submit: "Send inquiry →",
      submitting: "Sending…",
      submitted: "Received! We'll be in touch soon ✓",
      error: "Something went wrong. Please try again in a moment.",
      disclaimer: "By submitting you accept to be contacted by a NEOS advisor.",
    },
    footer: {
      blurb: "Real-estate arm of Grupo SaltaPor. Opportunities that deliver.",
      contactHeading: "Contact",
      projectsHeading: "Projects",
      copyright: (year: number) =>
        `© ${year} NEOS · Grupo SaltaPor. All rights reserved.`,
      tagline: "Made with care from northern Argentina.",
    },
    comingSoon: {
      pageInConstruction: "Detail page under construction",
    },
    project: {
      seeProgress: "See construction progress",
      requestInfo: "Request info",
      whatIs: (name: string) => `What is ${name}?`,
      location: "Location",
      units: "Units",
      tipology: "Typology",
      investFrom: "Investment from",
      distanceToSquare: "Distance to the square",
      amenities: "Amenities",
      amenitiesTitle: "Amenities to",
      amenitiesHighlight: "live and earn from",
      amenitiesEnd: ".",
      renders: "Project renders",
      gallery: "The project in images.",
      progressOfWork: "Construction progress",
      masterplan: "Master plan",
      stages: "Stages",
      plans: "Floor plans",
      plansBody: "Request them by email →",
      brochure: "Brochure",
      brochureBody: "Full project material →",
      progressBody: "Master plan + gallery →",
      seeAmenities: "See amenities",
      seeAmenitiesBody: "See all 13 amenities →",
      chaquies: {
        whatTitleA: "Over",
        whatHighlight: "20,000 m²",
        whatTitleB: "of development in the heart of Cafayate.",
        whatBody1:
          "Chaquíes brings together 164 units of studios, 1 and 2-bedroom apartments with a masterplan of 13 amenities designed to live, rest and earn.",
        whatBody2:
          "300 meters from the main square, it combines a privileged location, architectural scale and a program of services that sets a new standard for Cafayate.",
        metricUnits: "units",
        metricM2: "m² developed",
        metricAmenities: "amenities",
        contextEyebrow: "The context",
        contextTitleA: "Why invest in",
        contextHighlight: "Cafayate",
        contextTitleB: " today?",
        contextSubtitle:
          "One of the fastest-growing tourist destinations in northern Argentina — location, scarce premium supply and sustained demand.",
        reason1Eyebrow: "Established tourist destination",
        reason1Title: "Wine, mountains and heritage",
        reason1Body:
          "Cafayate combines high-altitude landscape, renowned wineries and a living historic center. A destination that grows year after year in occupancy and tourism spillover.",
        reason2Eyebrow: "Permanent demand for accommodation",
        reason2Title: "Tourism + second home",
        reason2Body:
          "A market where the supply of premium apartments is still scarce against a growing demand — short-term rentals, long weekends and high season.",
        reason3Eyebrow: "Strategic location",
        reason3Title: "300 meters from the main square",
        reason3Body:
          "The heart of Cafayate: walk to wineries, restaurants and town life. A location that doesn't repeat itself and defines value over time.",
        pullQuoteA:
          "A location meters from the square, an architecture designed for rest and a program of amenities that",
        pullQuoteHighlight: "redefines the Cafayate standard",
        pullQuoteB: ".",
        investEyebrow: "Pre-construction investment",
        investPart1: "Down payment",
        investPart2: " + 24 installments",
        investBody:
          "A financing structure designed for investors looking to capture Cafayate's value before delivery.",
      },
      neweken: {
        whatEyebrow: "What is Neweken?",
        whatTitleA: "A project designed to turn",
        whatHighlight: "energy growth",
        whatTitleB: "into real-estate income.",
        metric1Value: "+100",
        metric1Label: "fully equipped apartments",
        metric2Value: "100%",
        metric2Label: "managed by NEOS",
        metric3Value: "1st month",
        metric3Label: "you start earning rent",
        contextEyebrow: "The context",
        contextTitleA: "Why invest in",
        contextHighlight: "Vaca Muerta",
        contextTitleB: "today?",
        contextSubtitle:
          "Argentina's main engine of economic growth for the next decade — and one of the strongest real-estate opportunities in today's market.",
        reason1Eyebrow: "Global-scale opportunity",
        reason1Title: "Committed foreign investment",
        reason1Body:
          "Vaca Muerta projects exports of over USD 50 billion by 2030 — capital, stability and operational continuity backed by the world's leading energy companies.",
        reason2Eyebrow: "Permanent housing demand",
        reason2Title: "Technical and professional profiles",
        reason2Body:
          "Sustained growth in energy activity drives a structural housing demand from technical and operational workers, with rising employment projections between 2025 and 2030.",
        reason3Eyebrow: "Accelerated population growth",
        reason3Title: "Añelo: from 7,000 to 30,000 inhabitants",
        reason3Body:
          "Vaca Muerta's operational center. Housing pressure creates ideal conditions for profitable investment, high occupancy and steady capital appreciation.",
        pullEyebrow: "The moment is now",
        pullA:
          "Energy infrastructure is advancing faster than urban development. Those who invest today do so",
        pullHighlight:
          "before the gap between supply and demand closes",
        pullB: ", capturing the highest profit margins.",
        masterEyebrow: "Master plan",
        masterTitleA: "6 stages.",
        masterHighlight: "4 delivered, 2 under construction.",
        stageFinished: "Finished and operating",
        stageInProgress: "Under construction",
        investEyebrow: "Investment",
        investFromLabel: "From",
        investBody:
          "Access Vaca Muerta with a low ticket and a structure designed for investors looking for returns, predictability and professional management.",
      },
    },
    neo: {
      fab: {
        label: "Chat with Neo",
        proactiveTooltip: "Hi, I'm Neo. Can I help?",
      },
      header: {
        title: "Neo",
        subtitle: "NEOS assistant",
        closeLabel: "Close chat",
      },
      steps: {
        discover_intent: {
          text: "Hi! I'm Neo, NEOS' assistant. I'll help you explore our projects. What would you like to do?",
          choices: {
            inversion: "I want to invest",
            vivienda: "Find a home",
            info: "Just browsing",
          },
        },
        discover_region: {
          text: "Great. Any region in mind?",
          choices: {
            "cafayate": "Cafayate",
            "vaca-muerta": "Vaca Muerta",
            "salta-capital": "Salta Capital",
            "otro": "Not sure yet",
          },
        },
        show_projects: {
          text: (region: string) =>
            `Here are our projects in ${region}. Take a look at any you like and we'll continue.`,
          textNoRegion:
            "Here are some of our projects. Take a look at any you like and we'll continue.",
          continue: "Continue",
          viewProject: "View project →",
        },
        capture_name: {
          text: "So an advisor can send you personalized info — what's your name?",
          placeholder: "Your name",
          submit: "Continue",
          errorMin: "Please enter your full name",
        },
        capture_contact_channel: {
          text: (name: string) =>
            `Got it, ${name}. How would you prefer to be contacted?`,
          choices: {
            email: "By email",
            phone: "By WhatsApp",
          },
        },
        capture_contact_value: {
          textEmail: "Great. What's your email?",
          textPhone: "Great. What's your WhatsApp number?",
          placeholderEmail: "you@email.com",
          placeholderPhone: "+54 9 387 123 4567",
          submit: "Continue",
          errorEmail: "That email doesn't look valid",
          errorPhone: "That number doesn't look valid",
        },
        confirm: {
          text: (name: string) =>
            `Perfect, ${name}. Shall we confirm these details so an advisor can reach out?`,
          labelName: "Name",
          labelEmail: "Email",
          labelPhone: "WhatsApp",
          labelInterest: "Interest",
          labelRegion: "Region",
          labelProject: "Project",
          confirm: "Confirm & send",
          edit: "Edit details",
        },
        post_send: {
          text: (name: string) =>
            `All set, ${name}! A NEOS advisor will reach out shortly. Would you also like to message us on WhatsApp now?`,
          whatsapp: "Open WhatsApp",
          noThanks: "Later, thanks",
          whatsappPrefill: (
            name: string,
            interest: string | null,
            region: string | null,
          ) => {
            const parts = [`Hi, I'm ${name}. I talked to Neo on your website`];
            if (interest) parts.push(`and I'm interested in ${interest.toLowerCase()}`);
            if (region) parts.push(`in ${region}`);
            return parts.join(" ") + ".";
          },
        },
        closed: {
          text: "Thanks for chatting with Neo! Open the chat again whenever you want.",
          restart: "Start over",
        },
      },
      display: {
        interest: {
          inversion: "Investing",
          vivienda: "Housing",
          info: "Just browsing",
        },
        region: {
          "cafayate": "Cafayate",
          "vaca-muerta": "Vaca Muerta",
          "salta-capital": "Salta Capital",
          "otro": "Not sure yet",
        },
      },
      send: {
        sending: "Sending…",
        error: "Something went wrong. Please try again.",
        retry: "Retry",
      },
    },
  },
} as const;

export type Messages = (typeof messages)[Lang];
