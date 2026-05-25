import { Link } from "react-router-dom";
import { projects, type Project } from "../../data/projects";
import { Reveal } from "../ui/Reveal";
import { useT, useTr } from "../../i18n/LanguageContext";
import type { Messages } from "../../i18n/strings";

interface SpecItem {
  label: string;
  value: string;
}

function getFeaturedSpecs(
  project: Project,
  t: Messages,
  tr: <T>(v: { es: T; en: T }) => T
): SpecItem[] {
  const specs: SpecItem[] = [];
  if (project.units) specs.push({ label: t.projects.specUnits, value: tr(project.units) });
  if (project.tipologias)
    specs.push({ label: t.projects.specTipology, value: tr(project.tipologias) });
  if (project.amenities && project.amenities.length > 0)
    specs.push({
      label: t.projects.specAmenities,
      value: t.projects.amenitiesCount(project.amenities.length),
    });
  if (project.investment)
    specs.push({ label: t.projects.specInvestment, value: tr(project.investment) });
  return specs.slice(0, 4);
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const t = useT();
  const tr = useTr();
  const specs = featured ? getFeaturedSpecs(project, t, tr) : [];

  return (
    <Link
      id={project.slug}
      to={`/proyectos/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-base-300/60 bg-base-200 hover:border-primary/60 transition-all duration-500"
    >
      <div
        className={`relative ${featured ? "aspect-[16/12]" : "aspect-[4/5]"} flex-shrink-0 overflow-hidden bg-gradient-to-br ${project.gradient}`}
      >
        <img
          src={project.heroImage}
          alt={project.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover scale-100 group-hover:scale-[1.06] transition-transform duration-[1500ms] ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-base-100/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {tr(project.statusLabel)}
        </div>

        {project.hashtag && (
          <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-white/80 bg-primary/80 backdrop-blur-md px-2.5 py-1 rounded-full">
            {project.hashtag}
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-primary opacity-90 mb-3">
            {tr(project.location)}
          </p>
          {project.logo ? (
            <>
              <img
                src={project.logo}
                alt={project.name}
                className={`object-contain object-left ${featured ? "max-h-20 max-w-[280px]" : "max-h-14 max-w-[200px]"} mb-1 drop-shadow-lg`}
              />
              <h3 className="sr-only">{project.name}</h3>
            </>
          ) : (
            <h3
              className={`font-display font-semibold leading-tight ${featured ? "text-4xl lg:text-5xl" : "text-2xl"}`}
            >
              {project.name}
            </h3>
          )}
          <p
            className={`mt-3 opacity-85 max-w-md ${featured ? "text-base" : "text-sm"}`}
          >
            {tr(project.tagline)}
          </p>
        </div>
      </div>

      {featured ? (
        <div className="flex flex-1 flex-col gap-5 p-6 lg:p-8 border-t border-base-300/60">
          <p className="opacity-80 leading-relaxed text-sm lg:text-base">
            {tr(project.description)}
          </p>

          {specs.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 border-y border-base-300/40">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-[10px] uppercase tracking-widest text-primary mb-1">
                    {s.label}
                  </dt>
                  <dd className="text-sm leading-tight">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto flex items-center justify-between gap-4">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-75">
              {tr(project.highlights).slice(0, 3).map((h) => (
                <li key={h} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {h}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1 text-primary text-sm font-medium opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 whitespace-nowrap">
              {t.common.viewProject}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 flex items-center justify-between border-t border-base-300/60">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-75">
            {tr(project.highlights).slice(0, 2).map((h) => (
              <li key={h} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {h}
              </li>
            ))}
          </ul>
          <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 whitespace-nowrap">
            {t.common.viewProject}
          </span>
        </div>
      )}
    </Link>
  );
}

export function Projects() {
  const t = useT();
  return (
    <section id="proyectos" className="relative bg-base-100">
      <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            {t.projects.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            {t.projects.titleA} <em className="not-italic text-primary">{t.projects.titleHighlight}</em>{t.projects.titleB}
          </h2>
          <p className="mt-6 text-base sm:text-lg opacity-70 leading-relaxed">
            {t.projects.subtitle}
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[1fr]">
          {projects.map((p, idx) => (
            <Reveal
              key={p.slug}
              delay={idx * 120}
              className={idx === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
            >
              <ProjectCard project={p} featured={idx === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
