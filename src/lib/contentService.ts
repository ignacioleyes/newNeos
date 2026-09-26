import { supabase } from "./supabase";
import {
  mapProjects,
  mapRegions,
  mapSections,
  type Content,
  type ProjectRow,
  type RegionRow,
  type SectionRow,
} from "./contentMapping";

export type { Content };

/** El select de secciones con el slug del proyecto embebido, para poder agruparlas. */
export const SECTIONS_SELECT = "*, projects!inner(slug)";

/**
 * Trae el contenido de la landing desde Supabase.
 *
 * Una sola función para las tres tablas porque se necesitan juntas: las
 * regiones derivan sus dots y su conteo de los proyectos, y las secciones se
 * agrupan por slug. Traerlas de una también hace que navegar al detalle de un
 * proyecto sea instantáneo, sin una segunda espera.
 *
 * Con la anon key, la RLS devuelve únicamente proyectos publicados y sus
 * secciones visibles — que es exactamente lo que tiene que ver el público.
 */
export async function fetchContent(): Promise<Content> {
  const [projectsRes, regionsRes, sectionsRes] = await Promise.all([
    supabase.from("projects").select("*").order("display_order"),
    supabase.from("regions").select("*").order("display_order"),
    supabase.from("project_sections").select(SECTIONS_SELECT).order("position"),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (regionsRes.error) throw regionsRes.error;
  if (sectionsRes.error) throw sectionsRes.error;

  const regionRows = (regionsRes.data ?? []) as RegionRow[];
  const projects = mapProjects((projectsRes.data ?? []) as ProjectRow[], regionRows);

  return {
    projects,
    regions: mapRegions(regionRows, projects),
    sectionsByProject: mapSections((sectionsRes.data ?? []) as unknown as SectionRow[]),
  };
}
