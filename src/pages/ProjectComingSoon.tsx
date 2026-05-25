import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import { TopoPattern } from "../components/ui/TopoPattern";
import { useT, useTr } from "../i18n/LanguageContext";

export function ProjectComingSoon({ project }: { project: Project }) {
  const t = useT();
  const tr = useTr();

  return (
    <section className="relative min-h-[80svh] flex items-center justify-center px-6 py-32 overflow-hidden">
      <TopoPattern
        className="absolute inset-0 w-full h-full text-primary"
        opacity={0.18}
      />
      <div className="relative text-center max-w-2xl">
        {project.logo && (
          <img
            src={project.logo}
            alt={project.name}
            className="mx-auto mb-6 max-h-20 max-w-[280px] object-contain drop-shadow-lg"
          />
        )}
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          {tr(project.location)}
        </p>
        <h1 className="sr-only">{project.name}</h1>
        <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-6">
          {tr(project.tagline)}
        </p>
        <p className="opacity-70 mb-10 leading-relaxed">{tr(project.description)}</p>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {t.comingSoon.pageInConstruction}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn btn-ghost rounded-full px-6 border border-base-content/20 hover:border-primary hover:text-primary">
            {t.common.backToHome}
          </Link>
          <Link to="/#contacto" className="btn btn-primary rounded-full px-6">
            {t.common.contactCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
