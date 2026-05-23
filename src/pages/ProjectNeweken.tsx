import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { Contact } from "../components/sections/Contact";
import { Reveal } from "../components/ui/Reveal";
import { TopoPattern } from "../components/ui/TopoPattern";
import { CountUp } from "../components/ui/CountUp";
import { HeroImageCarousel } from "../components/ui/HeroImageCarousel";

const heroImages = [
  { src: "/projects/neweken/hero.png", alt: "Entrada al complejo Neweken" },
  { src: "/projects/neweken/aerial-2.jpg", alt: "Vista panorámica del complejo" },
  { src: "/projects/neweken/aerial-1.jpg", alt: "Vista cenital de Neweken" },
  { src: "/projects/neweken/construction.jpg", alt: "Avance constructivo" },
];

const project = projects.find((p) => p.slug === "neweken")!;

const investmentReasons = [
  {
    eyebrow: "Oportunidad de escala global",
    title: "Inversiones extranjeras comprometidas",
    body: "Vaca Muerta proyecta exportaciones por más de USD 50.000 millones a 2030 — capital, estabilidad y continuidad operativa garantizadas por las principales energéticas del mundo.",
  },
  {
    eyebrow: "Demanda habitacional permanente",
    title: "Perfiles técnicos y profesionales",
    body: "El crecimiento sostenido de la actividad energética implica una demanda habitacional estructural de perfiles técnicos y operativos, con proyecciones de empleo crecientes entre 2025 y 2030.",
  },
  {
    eyebrow: "Crecimiento demográfico acelerado",
    title: "Añelo: de 7.000 a 30.000 habitantes",
    body: "Centro operativo de Vaca Muerta. La presión habitacional genera condiciones ideales para inversiones rentables, alta ocupación y valorización constante del capital.",
  },
];

const stages = [
  { name: "Etapa 1", status: "Finalizada y en funcionamiento", active: false },
  { name: "Etapa 2", status: "Finalizada y en funcionamiento", active: false },
  { name: "Etapa 3", status: "Finalizada y en funcionamiento", active: false },
  { name: "Etapa 4", status: "Finalizada y en funcionamiento", active: false },
  { name: "Etapa 5", status: "En obra", active: true },
  { name: "Etapa 6", status: "En obra", active: true },
];

const galleryImages = [
  { src: "/projects/neweken/aerial-2.jpg", label: "Vista panorámica del complejo", colSpan: false },
  { src: "/projects/neweken/construction.jpg", label: "Avance constructivo", colSpan: false },
  { src: "/projects/neweken/aerial-1.jpg", label: "Vista cenital del master plan", colSpan: true },
];

function IconBlueprint() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18M9 13h6v4H9z" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

export function ProjectNeweken() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-base-100">
        <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-100 to-base-200" />
        <TopoPattern
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[140%] max-w-none text-primary"
          opacity={0.22}
        />

        <div className="relative container mx-auto px-6 lg:px-10 py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Link
              to="/#proyectos"
              className="hero-in inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] opacity-70 hover:opacity-100 hover:text-primary transition-colors mb-8"
              style={{ animationDelay: "50ms" }}
            >
              ← Volver a proyectos
            </Link>
            <div
              className="hero-in flex flex-wrap items-center gap-3 mb-6"
              style={{ animationDelay: "200ms" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-base-200 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest border border-base-300/60">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {project.statusLabel}
              </span>
              <span className="text-xs uppercase tracking-widest text-primary">
                {project.location}
              </span>
            </div>
            {project.logo && (
              <img
                src={project.logo}
                alt={project.name}
                className="hero-in max-h-16 sm:max-h-20 mb-8"
                style={{ animationDelay: "350ms" }}
              />
            )}
            <h1
              className="hero-in font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1] tracking-tight"
              style={{ animationDelay: "500ms" }}
            >
              {project.tagline}
            </h1>
            <div
              className="hero-in mt-10 flex flex-wrap gap-3"
              style={{ animationDelay: "700ms" }}
            >
              <a
                href="#avance-de-obra"
                className="btn btn-primary rounded-full px-6 group"
              >
                Ver avance de obra
                <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="#contacto"
                className="btn btn-ghost rounded-full px-6 border border-base-content/20 hover:border-primary hover:text-primary"
              >
                Solicitar info
              </a>
            </div>
          </div>

          {/* Image carousel on the right */}
          <div
            className="hero-in lg:col-span-5 relative"
            style={{ animationDelay: "550ms" }}
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-base-300/60 shadow-2xl bg-base-200">
              <HeroImageCarousel images={heroImages} interval={5000} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                  En obra
                </p>
                <p className="font-display text-2xl text-white leading-tight">
                  Añelo · Vaca Muerta
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECS BAR */}
      <section className="bg-base-200 border-y border-base-300/60">
        <div className="container mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Ubicación", value: "Añelo · Vaca Muerta" },
            { label: "Unidades", value: "+100 departamentos" },
            { label: "Tipología", value: "Equipados y administrados" },
            { label: "Inversión desde", value: "USD 45.900", primary: true },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] uppercase tracking-widest text-primary mb-1">
                {s.label}
              </p>
              <p
                className={`font-display font-semibold ${
                  s.primary ? "text-2xl text-primary" : "text-lg"
                }`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ¿QUÉ ES NEWEKEN? */}
      <section className="bg-base-100">
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              ¿Qué es Neweken?
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-8">
              Un proyecto pensado para transformar el{" "}
              <em className="not-italic text-primary">crecimiento energético</em>{" "}
              en renta inmobiliaria real.
            </h2>
            <div className="space-y-5 text-base sm:text-lg opacity-80 leading-relaxed">
              <p>{project.description}</p>
              {project.about && <p>{project.about}</p>}
            </div>
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {[
                { v: "+100", l: "departamentos equipados" },
                { v: "100%", l: "gestionado por NEOS" },
                { v: "1er mes", l: "comenzás a percibir renta" },
              ].map((m) => (
                <div key={m.l} className="border-t border-primary/60 pt-3">
                  <p className="font-display text-2xl font-semibold text-primary">
                    {m.v}
                  </p>
                  <p className="text-xs uppercase tracking-widest opacity-70 mt-1">
                    {m.l}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200} className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-base-300/60">
              <img
                src="/projects/neweken/aerial-1.jpg"
                alt="Vista aérea de Neweken"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ¿POR QUÉ INVERTIR EN VACA MUERTA? */}
      <section className="bg-base-200 border-y border-base-300/60 relative overflow-hidden">
        <TopoPattern
          className="absolute -right-40 top-0 w-[800px] text-primary"
          opacity={0.12}
        />
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
          <Reveal className="max-w-3xl mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              El contexto
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              ¿Por qué invertir hoy en{" "}
              <em className="not-italic text-primary">Vaca Muerta</em>?
            </h2>
            <p className="mt-6 opacity-75 leading-relaxed text-lg">
              El principal motor de crecimiento económico de la Argentina en la
              próxima década — y una de las oportunidades inmobiliarias más
              sólidas del mercado actual.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {investmentReasons.map((r, idx) => (
              <Reveal key={r.title} delay={idx * 150}>
                <div className="h-full bg-base-100 border border-base-300/60 rounded-2xl p-8 hover:border-primary/60 transition-colors">
                  <p className="text-xs uppercase tracking-widest text-primary mb-4">
                    {r.eyebrow}
                  </p>
                  <h3 className="font-display text-xl font-semibold mb-4 leading-tight">
                    {r.title}
                  </h3>
                  <p className="opacity-75 leading-relaxed">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PULL QUOTE — El momento es ahora */}
      <section className="bg-base-100 relative overflow-hidden border-b border-base-300/60">
        <TopoPattern
          className="absolute inset-0 w-full h-full text-primary"
          opacity={0.18}
        />
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
          <Reveal className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
              El momento es ahora
            </p>
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium leading-snug tracking-tight">
              La infraestructura energética avanza más rápido que el desarrollo
              urbano. Quienes invierten hoy lo hacen{" "}
              <em className="not-italic text-primary">
                antes de que la brecha entre oferta y demanda se cierre
              </em>
              , capturando los mayores márgenes de rentabilidad.
            </p>
          </Reveal>
        </div>
      </section>

      {/* MASTER PLAN / ETAPAS */}
      <section
        id="avance-de-obra"
        className="bg-base-200 border-t border-base-300/60"
      >
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <Reveal className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Master plan
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              6 etapas.{" "}
              <em className="not-italic text-primary">
                4 entregadas, 2 en obra.
              </em>
            </h2>
          </Reveal>

          <Reveal>
            <div className="relative rounded-2xl overflow-hidden border border-base-300/60 bg-base-100 aspect-[16/10]">
              <img
                src="/projects/neweken/render.jpg"
                alt="Master plan de Neweken"
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-6 gap-4">
            {stages.map((s, idx) => (
              <Reveal key={s.name} delay={idx * 80}>
                <div
                  className={`h-full border rounded-xl p-5 transition-colors ${
                    s.active
                      ? "border-primary bg-primary/10"
                      : "border-base-300/60 bg-base-100"
                  }`}
                >
                  <p
                    className={`font-display text-2xl font-semibold ${
                      s.active ? "text-primary" : ""
                    }`}
                  >
                    {s.name}
                  </p>
                  <p className="mt-2 text-xs opacity-75 leading-tight">
                    {s.status}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-base-100">
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <Reveal className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Avance de obra
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              El proyecto en imágenes.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {galleryImages.map((img, idx) => (
              <Reveal
                key={img.src}
                delay={idx * 120}
                className={img.colSpan ? "sm:col-span-2" : ""}
              >
                <div className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-base-300/60">
                  <img
                    src={img.src}
                    alt={img.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-xs uppercase tracking-widest text-white">
                    {img.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT CTA */}
      <section className="bg-base-200 border-y border-base-300/60 relative overflow-hidden">
        <TopoPattern
          className="absolute inset-0 w-full h-full text-primary"
          opacity={0.15}
        />
        <div className="container mx-auto px-6 lg:px-10 py-20 lg:py-28 relative text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Inversión
            </p>
            <p className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-none">
              Desde{" "}
              <span className="text-primary">
                USD <CountUp target={45900} />
              </span>
            </p>
            <p className="mt-6 opacity-80 max-w-2xl mx-auto leading-relaxed">
              Accedé a Vaca Muerta con un ticket bajo y una estructura pensada
              para inversores que buscan rentabilidad, previsibilidad y gestión
              profesional.
            </p>

            <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                {
                  icon: <IconBlueprint />,
                  title: "Plantas",
                  body: "Solicitalas por mail →",
                  href: "#contacto",
                },
                {
                  icon: <IconDocument />,
                  title: "Brochure",
                  body: "Material completo del proyecto →",
                  href: "#contacto",
                },
                {
                  icon: <IconPlay />,
                  title: "Avance de obra",
                  body: "Master plan + galería →",
                  href: "#avance-de-obra",
                },
              ].map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  className="group bg-base-100 hover:bg-primary border border-base-300/60 hover:border-primary rounded-2xl p-6 transition-all text-left"
                >
                  <div className="text-primary group-hover:text-primary-content mb-4 transition-colors">
                    {c.icon}
                  </div>
                  <p className="font-display text-lg font-semibold mb-1 group-hover:text-primary-content transition-colors">
                    {c.title}
                  </p>
                  <p className="text-xs opacity-70 group-hover:opacity-100 group-hover:text-primary-content transition-colors">
                    {c.body}
                  </p>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT (reuse) */}
      <Contact />
    </>
  );
}
