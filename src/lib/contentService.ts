import { supabase } from "./supabase";
import {
  mapProjects,
  mapRegions,
  type Content,
  type ProjectRow,
  type RegionRow,
} from "./contentMapping";

export type { Content };

/**
 * Trae el contenido de la landing desde Supabase.
 *
 * Una sola función para las dos tablas porque las regiones necesitan los
 * proyectos para derivar sus dots y su conteo. Separarlas obligaría a coordinar
 * dos queries que sólo sirven juntas.
 *
 * Con la anon key, la RLS devuelve únicamente los proyectos publicados — que es
 * exactamente lo que tiene que ver el público.
 */
export async function fetchContent(): Promise<Content> {
  const [projectsRes, regionsRes] = await Promise.all([
    supabase.from("projects").select("*").order("display_order"),
    supabase.from("regions").select("*").order("display_order"),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (regionsRes.error) throw regionsRes.error;

  const regionRows = (regionsRes.data ?? []) as RegionRow[];
  const projects = mapProjects((projectsRes.data ?? []) as ProjectRow[], regionRows);

  return { projects, regions: mapRegions(regionRows, projects) };
}
