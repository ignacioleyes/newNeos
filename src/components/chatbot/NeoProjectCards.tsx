import { useState } from "react";

export interface ProjectCardData {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
}

interface NeoProjectCardsProps {
  projects: ProjectCardData[];
  viewProjectLabel: string;
  continueLabel: string;
  /** Se llama al clickear "Continuar". Recibe el último slug que el user visitó
   * (o null si no abrió ninguno) — se guarda en el conversation log. */
  onContinue: (lastViewedSlug: string | null) => void;
}

/**
 * Lista compacta de project cards. Se renderiza en el step `show_projects`
 * con 1-3 proyectos filtrados por región. Cada card es un button que abre
 * el detalle en nueva pestaña (no rompe el flujo de la conversación).
 *
 * El componente trackea el último proyecto visitado y lo pasa a `onContinue`
 * para que quede registrado en el conversation log.
 */
export function NeoProjectCards({
  projects,
  viewProjectLabel,
  continueLabel,
  onContinue,
}: NeoProjectCardsProps) {
  const [lastViewed, setLastViewed] = useState<string | null>(null);

  function handleCardClick(slug: string) {
    setLastViewed(slug);
    window.open(`/proyectos/${slug}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        {projects.map((project) => {
          const isViewed = lastViewed === project.slug;
          return (
            <button
              key={project.slug}
              type="button"
              onClick={() => handleCardClick(project.slug)}
              aria-label={`${viewProjectLabel} ${project.name}`}
              className={`
                group w-full flex items-center gap-3 p-2.5 rounded-2xl
                border bg-base-100 text-left
                transition-all duration-200
                hover:border-primary hover:shadow-md
                active:scale-[0.98]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                ${isViewed ? "border-primary shadow-sm" : "border-base-300/60"}
              `}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-base-200">
                <img
                  src={project.heroImage}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              {/* Name + tagline */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{project.name}</p>
                <p className="text-xs opacity-60 truncate">{project.tagline}</p>
              </div>

              {/* Arrow */}
              <span
                aria-hidden
                className={`
                  flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full
                  transition-all duration-200
                  ${
                    isViewed
                      ? "bg-primary text-white"
                      : "text-base-content/40 group-hover:text-primary group-hover:bg-primary/10"
                  }
                `}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {/* Continuar */}
      <button
        type="button"
        onClick={() => onContinue(lastViewed)}
        className="
          w-full px-4 py-2.5 rounded-full text-sm font-semibold
          bg-primary text-white
          hover:bg-primary/90 active:scale-95
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
        "
      >
        {continueLabel}
      </button>
    </div>
  );
}
