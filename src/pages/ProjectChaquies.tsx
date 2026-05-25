import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { Contact } from "../components/sections/Contact";
import { Reveal } from "../components/ui/Reveal";
import { TopoPattern } from "../components/ui/TopoPattern";
import { CountUp } from "../components/ui/CountUp";
import { HeroImageCarousel } from "../components/ui/HeroImageCarousel";
import { AmenityIcon } from "../components/ui/AmenityIcon";
import { useT, useTr } from "../i18n/LanguageContext";

const project = projects.find((p) => p.slug === "chaquies")!;

const heroImages = [
  { src: "/projects/chaquies/newHero.jpg", alt: "Chaquíes — vineyards & mountains" },
  { src: "/projects/chaquies/sum-exterior.jpg", alt: "SUM exterior" },
  { src: "/projects/chaquies/kids-zone.jpg", alt: "Kids zone" },
  { src: "/projects/chaquies/piscina-cubierta.jpg", alt: "Indoor heated pool" },
];

export function ProjectChaquies() {
  const t = useT();
  const tr = useTr();
  const c = t.project.chaquies;

  const gallery = [
    {
      src: "/projects/chaquies/fachada.jpg",
      label: { es: "Fachada · vista frontal", en: "Facade · front view" },
      colSpan: true,
    },
    {
      src: "/projects/chaquies/sum-interior.jpg",
      label: { es: "SUM · interior", en: "SUM · interior" },
      colSpan: false,
    },
    {
      src: "/projects/chaquies/piscina-cubierta.jpg",
      label: {
        es: "Piscina interior climatizada",
        en: "Indoor heated pool",
      },
      colSpan: false,
    },
    {
      src: "/projects/chaquies/obra-avance.jpg",
      label: { es: "Avance de obra", en: "Construction progress" },
      colSpan: true,
    },
  ];

  const amenities = project.amenities ?? [];

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
              <span className="text-xs uppercase tracking-widest text-primary">
                {project.hashtag}
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
            <p
              className="hero-in mt-8 max-w-xl text-base sm:text-lg opacity-80 leading-relaxed"
              style={{ animationDelay: "650ms" }}
            >
              {tr(project.description)}
            </p>
            <div
              className="hero-in mt-10 flex flex-wrap gap-3"
              style={{ animationDelay: "800ms" }}
            >
              <a
                href="#amenities"
                className="btn btn-primary rounded-full px-6 group"
              >
                {t.project.seeAmenities}
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

          <div
            className="hero-in lg:col-span-5 relative"
            style={{ animationDelay: "550ms" }}
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-base-300/60 shadow-2xl bg-base-200">
              <HeroImageCarousel images={heroImages} interval={5000} />
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

      {/* SPECS BAR */}
      <section className="bg-base-200 border-y border-base-300/60">
        <div className="container mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t.project.location, value: tr(project.location) },
            { label: t.project.units, value: project.units ? tr(project.units) : "" },
            { label: t.project.tipology, value: project.tipologias ? tr(project.tipologias) : "" },
            { label: t.project.distanceToSquare, value: "300 m", primary: true },
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

      {/* ¿QUÉ ES CHAQUÍES? */}
      <section className="bg-base-100">
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              {t.project.whatIs(project.name)}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-8">
              {c.whatTitleA}{" "}
              <em className="not-italic text-primary">{c.whatHighlight}</em>{" "}
              {c.whatTitleB}
            </h2>
            <div className="space-y-5 text-base sm:text-lg opacity-80 leading-relaxed">
              <p>{c.whatBody1}</p>
              <p>{c.whatBody2}</p>
            </div>
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {[
                { v: "164", l: c.metricUnits },
                { v: "+20.000", l: c.metricM2 },
                { v: "13", l: c.metricAmenities },
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
                src="/projects/chaquies/sum-exterior.jpg"
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTEXTO CAFAYATE */}
      <section className="bg-base-200 border-y border-base-300/60 relative overflow-hidden">
        <TopoPattern
          className="absolute -right-40 top-0 w-[800px] text-primary"
          opacity={0.12}
        />
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
          <Reveal className="max-w-3xl mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              {c.contextEyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              {c.contextTitleA}{" "}
              <em className="not-italic text-primary">{c.contextHighlight}</em>
              {c.contextTitleB}
            </h2>
            <p className="mt-6 opacity-75 leading-relaxed text-lg">
              {c.contextSubtitle}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { eyebrow: c.reason1Eyebrow, title: c.reason1Title, body: c.reason1Body },
              { eyebrow: c.reason2Eyebrow, title: c.reason2Title, body: c.reason2Body },
              { eyebrow: c.reason3Eyebrow, title: c.reason3Title, body: c.reason3Body },
            ].map((r, idx) => (
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

      {/* AMENITIES */}
      <section id="amenities" className="bg-base-100">
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <Reveal className="max-w-3xl mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              {t.project.amenities}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              {t.project.amenitiesTitle}{" "}
              <em className="not-italic text-primary">
                {t.project.amenitiesHighlight}
              </em>
              {t.project.amenitiesEnd}
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
      </section>

      {/* PULL QUOTE */}
      <section className="bg-base-200 relative overflow-hidden border-y border-base-300/60">
        <TopoPattern
          className="absolute inset-0 w-full h-full text-primary"
          opacity={0.18}
        />
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
          <Reveal className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
              {project.hashtag}
            </p>
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium leading-snug tracking-tight">
              {c.pullQuoteA}{" "}
              <em className="not-italic text-primary">
                {c.pullQuoteHighlight}
              </em>
              {c.pullQuoteB}
            </p>
          </Reveal>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="bg-base-100">
        <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <Reveal className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              {t.project.renders}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              {t.project.gallery}
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {gallery.map((img, idx) => (
              <Reveal
                key={img.src}
                delay={idx * 120}
                className={img.colSpan ? "sm:col-span-2" : ""}
              >
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
      </section>

      {/* INVERSIÓN CTA */}
      <section className="bg-base-200 border-y border-base-300/60 relative overflow-hidden">
        <TopoPattern
          className="absolute inset-0 w-full h-full text-primary"
          opacity={0.15}
        />
        <div className="container mx-auto px-6 lg:px-10 py-20 lg:py-28 relative text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              {c.investEyebrow}
            </p>
            <p className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-none">
              {c.investPart1}{" "}
              <span className="text-primary">
                <CountUp target={40} />%
              </span>
              <span className="block sm:inline">{c.investPart2}</span>
            </p>
            <p className="mt-6 opacity-80 max-w-2xl mx-auto leading-relaxed">
              {c.investBody}
            </p>

            <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { title: t.project.plans, body: t.project.plansBody, href: "#contacto" },
                { title: t.project.brochure, body: t.project.brochureBody, href: "#contacto" },
                { title: t.project.amenities, body: t.project.seeAmenitiesBody, href: "#amenities" },
              ].map((cc) => (
                <a
                  key={cc.title}
                  href={cc.href}
                  className="group bg-base-100 hover:bg-primary border border-base-300/60 hover:border-primary rounded-2xl p-6 transition-all text-left"
                >
                  <p className="font-display text-lg font-semibold mb-1 group-hover:text-primary-content transition-colors">
                    {cc.title}
                  </p>
                  <p className="text-xs opacity-70 group-hover:opacity-100 group-hover:text-primary-content transition-colors">
                    {cc.body}
                  </p>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Contact />
    </>
  );
}
