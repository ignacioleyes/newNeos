import { Link } from "react-router-dom";
import type { Project } from "../../data/projects";
import type {
  ProjectSection,
  HeroData,
  SpecsData,
  WhatIsData,
  ContextData,
  AmenitiesData,
  PullQuoteData,
  MasterplanData,
  GalleryData,
  CtaData,
  CtaIcon,
} from "../../lib/sections";
import { Contact } from "../sections/Contact";
import { Reveal } from "../ui/Reveal";
import { TopoPattern } from "../ui/TopoPattern";
import { CountUp } from "../ui/CountUp";
import { HeroImageCarousel } from "../ui/HeroImageCarousel";
import { AmenityIcon } from "../ui/AmenityIcon";
import { useT, useTr } from "../../i18n/LanguageContext";
import type { Messages } from "../../i18n/strings";
import type { Localized } from "../../i18n/types";

/**
 * Renderiza una página de proyecto a partir de sus secciones.
 *
 * Reemplaza las páginas escritas a mano (ProjectChaquies, ProjectNeweken): el
 * mismo componente sirve para cualquier proyecto, y qué secciones tiene y en
 * qué orden sale de la base.
 *
 * Los fondos NO se guardan: alternan por posición (base-100 / base-200), que es
 * lo que hacían las dos páginas originales sin excepción. Así la alternancia se
 * mantiene correcta con cualquier combinación de secciones que arme el admin,
 * en vez de depender de que elija bien un color.
 */

type Tr = <T>(v: Localized<T>) => T;

// -----------------------------------------------------------------------------
// Título con fragmento resaltado
// -----------------------------------------------------------------------------

/** Pinta de primary lo que venga [entre corchetes]. Ver la nota en lib/sections. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]*\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <em key={i} className="not-italic text-primary">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        )
      )}
    </>
  );
}

// -----------------------------------------------------------------------------
// Iconos de las tarjetas del CTA
// -----------------------------------------------------------------------------

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  className: "h-6 w-6",
} as const;

const CTA_ICONS: Record<CtaIcon, () => React.ReactElement> = {
  blueprint: () => (
    <svg {...ICON_PROPS}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18M9 13h6v4H9z" />
    </svg>
  ),
  document: () => (
    <svg {...ICON_PROPS}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  ),
  play: () => (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  ),
};

// -----------------------------------------------------------------------------
// Renderers por kind
// -----------------------------------------------------------------------------

interface Ctx {
  project: Project;
  t: Messages;
  tr: Tr;
}

function HeroSection({ data, ctx }: { data: HeroData; ctx: Ctx }) {
  const { project, t, tr } = ctx;
  return (
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
            {t.common.backToProjects}
          </Link>
          <div
            className="hero-in flex flex-wrap items-center gap-3 mb-6"
            style={{ animationDelay: "200ms" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-base-200 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest border border-base-300/60">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {tr(project.statusLabel)}
            </span>
            {/* Los proyectos sin hashtag muestran la ubicación en ese lugar. */}
            <span className="text-xs uppercase tracking-widest text-primary">
              {project.hashtag ?? tr(project.location)}
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
            {tr(project.tagline)}
          </h1>
          {data.showDescription && (
            <p
              className="hero-in mt-8 max-w-xl text-base sm:text-lg opacity-80 leading-relaxed"
              style={{ animationDelay: "650ms" }}
            >
              {tr(project.description)}
            </p>
          )}
          <div
            className="hero-in mt-10 flex flex-wrap gap-3"
            style={{ animationDelay: data.showDescription ? "800ms" : "700ms" }}
          >
            <a href={data.ctaHref} className="btn btn-primary rounded-full px-6 group">
              {tr(data.ctaLabel)}
              <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#contacto"
              className="btn btn-ghost rounded-full px-6 border border-base-content/20 hover:border-primary hover:text-primary"
            >
              {t.project.requestInfo}
            </a>
          </div>
        </div>

        <div className="hero-in lg:col-span-5 relative" style={{ animationDelay: "550ms" }}>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-base-300/60 shadow-2xl bg-base-200">
            <HeroImageCarousel images={data.images.map((i) => ({ src: i.src, alt: i.alt ?? project.name }))} interval={5000} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                {tr(project.statusLabel)}
              </p>
              <p className="font-display text-2xl text-white leading-tight">
                {tr(project.location)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecsSection({ data, ctx }: { data: SpecsData; ctx: Ctx }) {
  const { project, t, tr } = ctx;

  // Los tres primeros salen del proyecto para no duplicar el dato.
  const specs: { label: string; value: string; primary?: boolean }[] = [
    { label: t.project.location, value: tr(project.location) },
  ];
  if (project.units) specs.push({ label: t.project.units, value: tr(project.units) });
  if (project.tipologias)
    specs.push({ label: t.project.tipology, value: tr(project.tipologias) });
  for (const e of data.extra ?? []) {
    specs.push({ label: tr(e.label), value: tr(e.value), primary: true });
  }

  return (
    <div className="container mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
      {specs.map((s) => (
        <div key={s.label}>
          <p className="text-[10px] uppercase tracking-widest text-primary mb-1">{s.label}</p>
          <p className={`font-display font-semibold ${s.primary ? "text-2xl text-primary" : "text-lg"}`}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function WhatIsSection({ data, ctx }: { data: WhatIsData; ctx: Ctx }) {
  const { project, t, tr } = ctx;
  return (
    <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
      <Reveal className="lg:col-span-7">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          {data.eyebrow ? tr(data.eyebrow) : t.project.whatIs(project.name)}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-8">
          <Highlighted text={tr(data.title)} />
        </h2>
        <div className="space-y-5 text-base sm:text-lg opacity-80 leading-relaxed">
          {tr(data.body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {data.metrics.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {data.metrics.map((m) => (
              <div key={tr(m.label)} className="border-t border-primary/60 pt-3">
                <p className="font-display text-2xl font-semibold text-primary">{m.value}</p>
                <p className="text-xs uppercase tracking-widest opacity-70 mt-1">{tr(m.label)}</p>
              </div>
            ))}
          </div>
        )}
      </Reveal>
      {data.image && (
        <Reveal delay={200} className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-base-300/60">
            <img
              src={data.image}
              alt={project.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </Reveal>
      )}
    </div>
  );
}

function ContextSection({ data, ctx }: { data: ContextData; ctx: Ctx }) {
  const { tr } = ctx;
  return (
    <>
      <TopoPattern className="absolute -right-40 top-0 w-[800px] text-primary" opacity={0.12} />
      <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{tr(data.eyebrow)}</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
            <Highlighted text={tr(data.title)} />
          </h2>
          {data.subtitle && (
            <p className="mt-6 opacity-75 leading-relaxed text-lg">{tr(data.subtitle)}</p>
          )}
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {data.reasons.map((r, idx) => (
            <Reveal key={tr(r.title)} delay={idx * 150}>
              <div className="h-full bg-base-100 border border-base-300/60 rounded-2xl p-8 hover:border-primary/60 transition-colors">
                <p className="text-xs uppercase tracking-widest text-primary mb-4">{tr(r.eyebrow)}</p>
                <h3 className="font-display text-xl font-semibold mb-4 leading-tight">{tr(r.title)}</h3>
                <p className="opacity-75 leading-relaxed">{tr(r.body)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

function AmenitiesSection({ data, ctx }: { data: AmenitiesData; ctx: Ctx }) {
  const { project, t, tr } = ctx;
  const amenities = project.amenities ?? [];
  if (amenities.length === 0) return null;

  return (
    <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <Reveal className="max-w-3xl mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          {data.eyebrow ? tr(data.eyebrow) : t.project.amenities}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
          {data.title ? (
            <Highlighted text={tr(data.title)} />
          ) : (
            <>
              {t.project.amenitiesTitle}{" "}
              <em className="not-italic text-primary">{t.project.amenitiesHighlight}</em>
              {t.project.amenitiesEnd}
            </>
          )}
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {amenities.map((a, idx) => (
          <Reveal key={a.key} delay={idx * 40}>
            <div className="group h-full flex flex-col items-center text-center bg-base-200 border border-base-300/60 rounded-xl p-6 hover:border-primary hover:bg-base-300/40 transition-all">
              <AmenityIcon
                name={a.key}
                className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform"
              />
              <p className="font-display text-sm sm:text-base font-medium leading-tight uppercase tracking-wide group-hover:text-primary transition-colors">
                {tr(a.label)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function PullQuoteSection({ data, ctx }: { data: PullQuoteData; ctx: Ctx }) {
  const { project, tr } = ctx;
  const eyebrow = data.eyebrow ? tr(data.eyebrow) : project.hashtag;
  return (
    <>
      <TopoPattern className="absolute inset-0 w-full h-full text-primary" opacity={0.18} />
      <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
        <Reveal className="max-w-4xl mx-auto text-center">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">{eyebrow}</p>
          )}
          <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium leading-snug tracking-tight">
            <Highlighted text={tr(data.quote)} />
          </p>
        </Reveal>
      </div>
    </>
  );
}

function MasterplanSection({ data, ctx }: { data: MasterplanData; ctx: Ctx }) {
  const { tr } = ctx;
  return (
    <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <Reveal className="max-w-3xl mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{tr(data.eyebrow)}</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
          <Highlighted text={tr(data.title)} />
        </h2>
      </Reveal>

      <Reveal>
        <div className="relative rounded-2xl overflow-hidden border border-base-300/60 bg-base-100 aspect-[16/10]">
          <img
            src={data.image}
            alt="Master plan"
            className="absolute inset-0 w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </Reveal>

      {data.stages.length > 0 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-6 gap-4">
          {data.stages.map((s, idx) => (
            <Reveal key={s.name} delay={idx * 80}>
              <div
                className={`h-full border rounded-xl p-5 transition-colors ${
                  s.active ? "border-primary bg-primary/10" : "border-base-300/60 bg-base-100"
                }`}
              >
                <p className={`font-display text-2xl font-semibold ${s.active ? "text-primary" : ""}`}>
                  {s.name}
                </p>
                <p className="mt-2 text-xs opacity-75 leading-tight">{tr(s.status)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function GallerySection({ data, ctx }: { data: GalleryData; ctx: Ctx }) {
  const { tr } = ctx;
  return (
    <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <Reveal className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{tr(data.eyebrow)}</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
          {tr(data.title)}
        </h2>
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-4">
        {data.images.map((img, idx) => (
          <Reveal key={img.src} delay={idx * 120} className={img.wide ? "sm:col-span-2" : ""}>
            <div className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-base-300/60">
              <img
                src={img.src}
                alt={tr(img.label)}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <p className="absolute bottom-4 left-4 text-xs uppercase tracking-widest text-white">
                {tr(img.label)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function CtaSection({ data, ctx }: { data: CtaData; ctx: Ctx }) {
  const { tr } = ctx;
  return (
    <>
      <TopoPattern className="absolute inset-0 w-full h-full text-primary" opacity={0.15} />
      <div className="container mx-auto px-6 lg:px-10 py-20 lg:py-28 relative text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{tr(data.eyebrow)}</p>
          <p className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-none">
            {tr(data.lead)}{" "}
            {data.amount != null && (
              <span className="text-primary">
                {data.amountPrefix}
                <CountUp target={data.amount} />
                {data.amountSuffix}
              </span>
            )}
            {data.trail && <span className="block sm:inline">{tr(data.trail)}</span>}
          </p>
          <p className="mt-6 opacity-80 max-w-2xl mx-auto leading-relaxed">{tr(data.body)}</p>

          {data.cards.length > 0 && (
            <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {data.cards.map((c) => {
                const Icon = c.icon ? CTA_ICONS[c.icon] : null;
                return (
                  <a
                    key={tr(c.title)}
                    href={c.href}
                    className="group bg-base-100 hover:bg-primary border border-base-300/60 hover:border-primary rounded-2xl p-6 transition-all text-left"
                  >
                    {Icon && (
                      <div className="text-primary group-hover:text-primary-content mb-4 transition-colors">
                        <Icon />
                      </div>
                    )}
                    <p className="font-display text-lg font-semibold mb-1 group-hover:text-primary-content transition-colors">
                      {tr(c.title)}
                    </p>
                    <p className="text-xs opacity-70 group-hover:opacity-100 group-hover:text-primary-content transition-colors">
                      {tr(c.body)}
                    </p>
                  </a>
                );
              })}
            </div>
          )}
        </Reveal>
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// Template
// -----------------------------------------------------------------------------

/** Anclas que los CTA del hero y de las tarjetas usan para saltar a la sección. */
const SECTION_ANCHORS: Partial<Record<ProjectSection["kind"], string>> = {
  amenities: "amenities",
  masterplan: "avance-de-obra",
};

export function ProjectTemplate({
  project,
  sections,
}: {
  project: Project;
  sections: ProjectSection[];
}) {
  const t = useT();
  const tr = useTr();
  const ctx: Ctx = { project, t, tr };

  const visible = [...sections]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.position - b.position);

  return (
    <>
      {visible.map((section, idx) => {
        // El hero trae su propio fondo y layout de pantalla completa.
        if (section.kind === "hero") {
          return <HeroSection key={section.id} data={section.data as HeroData} ctx={ctx} />;
        }

        // Fondos alternados por posición: es lo que hacían las dos páginas
        // originales, y así no depende de que el admin elija bien un color.
        const dark = idx % 2 === 1;
        const bg = dark
          ? "bg-base-200 border-y border-base-300/60"
          : "bg-base-100";
        const needsRelative =
          section.kind === "context" ||
          section.kind === "pull_quote" ||
          section.kind === "cta";

        return (
          <section
            key={section.id}
            id={SECTION_ANCHORS[section.kind]}
            className={`${bg} ${needsRelative ? "relative overflow-hidden" : ""}`}
          >
            {renderSection(section, ctx)}
          </section>
        );
      })}

      <Contact />
    </>
  );
}

function renderSection(section: ProjectSection, ctx: Ctx) {
  switch (section.kind) {
    case "specs":
      return <SpecsSection data={section.data as SpecsData} ctx={ctx} />;
    case "what_is":
      return <WhatIsSection data={section.data as WhatIsData} ctx={ctx} />;
    case "context":
      return <ContextSection data={section.data as ContextData} ctx={ctx} />;
    case "amenities":
      return <AmenitiesSection data={section.data as AmenitiesData} ctx={ctx} />;
    case "pull_quote":
      return <PullQuoteSection data={section.data as PullQuoteData} ctx={ctx} />;
    case "masterplan":
      return <MasterplanSection data={section.data as MasterplanData} ctx={ctx} />;
    case "gallery":
      return <GallerySection data={section.data as GalleryData} ctx={ctx} />;
    case "cta":
      return <CtaSection data={section.data as CtaData} ctx={ctx} />;
    default:
      return null;
  }
}
