import { projectGradient, regionGradient, statusLabel } from "./presentation";
import type { Project, ProjectStatus } from "../data/projects";
import type { Region, MapDot } from "../data/regions";

/**
 * Mapea las filas de Supabase a los tipos que
 * los componentes ya consumen (`Project`, `Region`).
 *
 * El mapeo vive acá y no en los componentes a propósito: así cambiar el schema
 * de la base toca un solo archivo, y el generador del snapshot
 * (scripts/gen-snapshot.mts) reusa estas mismas funciones — si el mapeo se
 * duplicara, el snapshot y la app divergirían en silencio.
 */

// -----------------------------------------------------------------------------
// Forma cruda de las filas
// -----------------------------------------------------------------------------

export interface ProjectRow {
  slug: string;
  name: string;
  hashtag: string | null;
  tagline: Project["tagline"];
  description: Project["description"];
  about: Project["about"] | null;
  location: Project["location"];
  region_slug: string;
  status: string;
  units: Project["units"] | null;
  tipologias: Project["tipologias"] | null;
  investment: Project["investment"] | null;
  amenities: Project["amenities"];
  services: Project["services"] | null;
  highlights: Project["highlights"];
  hero_image: string;
  logo: string | null;
  brochure_url: string | null;
  progress_url: string | null;
  video_embed: string | null;
  maps_url: string | null;
  gradient_key: string;
  lat: number | null;
  lng: number | null;
  display_order: number;
  is_featured: boolean;
}

export interface RegionRow {
  slug: string;
  name: string;
  description: Region["description"];
  lat: number;
  lng: number;
  map_center_lat: number;
  map_center_lng: number;
  map_zoom: number;
  gradient_key: string;
  display_order: number;
}

export interface Content {
  projects: Project[];
  regions: Region[];
}

// -----------------------------------------------------------------------------
// Mapeo
// -----------------------------------------------------------------------------

/** `undefined` en vez de `null`: los campos opcionales del tipo Project son `?`. */
function opt<T>(v: T | null): T | undefined {
  return v ?? undefined;
}

export function mapProjects(rows: ProjectRow[], regionRows: RegionRow[]): Project[] {
  const regionNameBySlug = new Map(regionRows.map((r) => [r.slug, r.name]));

  return [...rows]
    .sort((a, b) => a.display_order - b.display_order)
    .map((r) => ({
      slug: r.slug,
      name: r.name,
      hashtag: opt(r.hashtag),
      tagline: r.tagline,
      description: r.description,
      about: opt(r.about),
      location: r.location,
      // Los componentes usan el nombre de la región, no el slug.
      region: regionNameBySlug.get(r.region_slug) ?? r.region_slug,
      regionSlug: r.region_slug,
      status: r.status as ProjectStatus,
      statusLabel: statusLabel(r.status),
      units: opt(r.units),
      tipologias: opt(r.tipologias),
      investment: opt(r.investment),
      amenities: r.amenities ?? [],
      services: opt(r.services),
      highlights: r.highlights,
      heroImage: r.hero_image,
      logo: opt(r.logo),
      brochureUrl: opt(r.brochure_url),
      progressUrl: opt(r.progress_url),
      videoEmbed: opt(r.video_embed),
      mapsUrl: opt(r.maps_url),
      gradient: projectGradient(r.gradient_key),
      lat: opt(r.lat),
      lng: opt(r.lng),
      displayOrder: r.display_order,
      isFeatured: r.is_featured,
    }));
}

/**
 * Los dots del mapa se derivan de los proyectos: cada proyecto con coordenadas
 * pone su marcador en el mapa de su región. Antes eran una lista aparte en
 * regions.ts que había que mantener sincronizada a mano.
 */
export function mapRegions(rows: RegionRow[], projects: Project[]): Region[] {
  return [...rows]
    .sort((a, b) => a.display_order - b.display_order)
    .map((r) => {
      const own = projects.filter((p) => p.regionSlug === r.slug);
      const dots: MapDot[] = own
        .filter((p) => p.lat != null && p.lng != null)
        .map((p) => ({
          lat: p.lat!,
          lng: p.lng!,
          label: p.name,
          status: p.status === "finalizado" ? "finalized" : "in-progress",
          projectSlug: p.slug,
        }));

      return {
        slug: r.slug,
        name: r.name,
        description: r.description,
        // Derivado, no almacenado: se desincronizaba apenas alguien cargaba un proyecto.
        projectsCount: own.length,
        coords: { lat: r.lat, lng: r.lng },
        map: {
          center: [r.map_center_lat, r.map_center_lng] as [number, number],
          zoom: r.map_zoom,
        },
        dots,
        gradient: regionGradient(r.gradient_key),
      };
    });
}

