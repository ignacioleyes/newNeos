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
      trackRecordTitle: "Trayectoria",
      trackRecordSubtitle:
        "Desarrollos que ya forman parte del recorrido de NEOS.",
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
      trackRecordTitle: "Track record",
      trackRecordSubtitle:
        "Developments that are already part of the NEOS story.",
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
