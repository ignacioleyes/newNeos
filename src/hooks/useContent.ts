import { useQuery } from "@tanstack/react-query";
import { fetchContent, type Content } from "../lib/contentService";
import { projectsSnapshot, regionsSnapshot } from "../data/content.snapshot";
import type { Project } from "../data/projects";
import type { Region } from "../data/regions";
import { GRID_CAPACITY } from "../lib/presentation";

/**
 * El contenido de la landing, desde Supabase y con el snapshot como red.
 *
 * `placeholderData` hace que la primera pintura sea instantánea con el último
 * contenido conocido, en vez de un spinner. La home es una pieza de conversión:
 * un spinner en el hero cuesta visitas.
 *
 * Ojo con un detalle de TanStack Query: `placeholderData` sólo aplica mientras
 * la query está *pending*. Si falla, el estado pasa a `error` y `data` queda
 * `undefined`. Como también queremos cubrir el caso "Supabase pausado o caído",
 * el fallback al snapshot va explícito abajo (`?? SNAPSHOT`) y no delegado.
 */
const SNAPSHOT: Content = {
  projects: projectsSnapshot,
  regions: regionsSnapshot,
};

export const CONTENT_QUERY_KEY = ["content"] as const;

export function useContentQuery() {
  return useQuery({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: fetchContent,
    placeholderData: SNAPSHOT,
    // El contenido lo edita gente, no un sistema: no cambia entre pestañas.
    staleTime: 5 * 60_000,
  });
}

/** El contenido, siempre definido: cae al snapshot mientras carga o si falla. */
export function useContent(): Content {
  const { data } = useContentQuery();
  return data ?? SNAPSHOT;
}

export function useProjects(): Project[] {
  return useContent().projects;
}

export function useRegions(): Region[] {
  return useContent().regions;
}

export function useProject(slug: string | undefined): Project | undefined {
  return useProjects().find((p) => p.slug === slug);
}

/**
 * Parte los proyectos entre los que arman la composición de la grilla y los que
 * quedan abajo, en "Trayectoria".
 *
 * El corte lo define sólo `displayOrder`, no el estado del proyecto: un
 * desarrollo terminado emblemático puede seguir en la grilla si NEOS quiere, y
 * eso es una decisión editorial que le corresponde a ellos, no al schema.
 *
 * El destacado se fuerza al frente para que ocupe la celda 2x2 de arriba a la
 * izquierda, que es donde la grilla lo espera.
 */
export function useProjectsSplit(): { grid: Project[]; rest: Project[] } {
  const projects = useProjects();
  const ordered = [...projects].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.displayOrder - b.displayOrder;
  });
  return {
    grid: ordered.slice(0, GRID_CAPACITY),
    rest: ordered.slice(GRID_CAPACITY),
  };
}
