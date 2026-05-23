import { Link } from "react-router-dom";
import { projects, type Project } from "../../data/projects";
import { Reveal } from "../ui/Reveal";

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Link
      id={project.slug}
      to={`/proyectos/${project.slug}`}
      className="group relative block h-full overflow-hidden rounded-2xl border border-base-300/60 bg-base-200 hover:border-primary/60 transition-all duration-500"
    >
      <div
        className={`relative ${featured ? "aspect-[16/12]" : "aspect-[4/5]"} overflow-hidden bg-gradient-to-br ${project.gradient}`}
      >
        {/* Real hero image */}
        <img
          src={project.heroImage}
          alt={project.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover scale-100 group-hover:scale-[1.06] transition-transform duration-[1500ms] ease-out"
        />

        {/* Darkening gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        {/* Status pill */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-base-100/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {project.statusLabel}
        </div>

        {/* Optional hashtag chip top-right */}
        {project.hashtag && (
          <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-white/80 bg-primary/80 backdrop-blur-md px-2.5 py-1 rounded-full">
            {project.hashtag}
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-primary opacity-90 mb-3">
            {project.location}
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
          <p className={`mt-3 opacity-85 max-w-md ${featured ? "text-base" : "text-sm"}`}>
            {project.tagline}
          </p>
        </div>
      </div>

      <div className="p-6 flex items-center justify-between border-t border-base-300/60">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-75">
          {project.highlights.slice(0, featured ? 3 : 2).map((h) => (
            <li key={h} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              {h}
            </li>
          ))}
        </ul>
        <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 whitespace-nowrap">
          Ver proyecto →
        </span>
      </div>
    </Link>
  );
}

export function Projects() {
  return (
    <section id="proyectos" className="relative bg-base-100">
      <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Portfolio activo
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            Proyectos que <em className="not-italic text-primary">trascienden</em>.
          </h2>
          <p className="mt-6 text-base sm:text-lg opacity-70 leading-relaxed">
            Cada desarrollo es una lectura del territorio: ubicación, escala humana,
            diseño y rentabilidad pensados en conjunto.
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
