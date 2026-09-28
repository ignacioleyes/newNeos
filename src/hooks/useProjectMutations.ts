import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { CONTENT_QUERY_KEY } from "./useContent";
import type { Localized } from "../i18n/types";

/**
 * Mutaciones del panel sobre proyectos.
 *
 * Todas invalidan la misma query (`content`) que usa la landing, así que
 * después de guardar el panel y el sitio público quedan mostrando lo mismo sin
 * coordinación extra.
 *
 * Ojo con un detalle de PostgREST: un UPDATE que la RLS filtra devuelve 204,
 * que parece éxito, pero no modificó nada. Por eso las mutaciones piden la fila
 * de vuelta (`.select()`) y verifican que haya venido algo: si no, lo que pasó
 * es que no había permiso, y hay que decirlo en vez de fingir que guardó.
 */

function useInvalidateContent() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
}

export function useTogglePublished() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async ({ slug, published }: { slug: string; published: boolean }) => {
      const { data, error } = await supabase
        .from("projects")
        .update({ is_published: published })
        .eq("slug", slug)
        .select("slug");

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(
          "No se pudo guardar: la base no dejó modificar ese proyecto. Puede ser un problema de permisos."
        );
      }
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useSetFeatured() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async (slug: string) => {
      // Vía RPC y no con dos updates: apagar el anterior y prender el nuevo
      // tienen que pasar en la misma transacción, o la grilla queda sin
      // destacado si falla el segundo.
      const { error } = await supabase.rpc("set_featured_project", { p_slug: slug });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useReorderProjects() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async (slugsInOrder: string[]) => {
      const { error } = await supabase.rpc("reorder_projects", { p_slugs: slugsInOrder });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

/**
 * Guarda los campos editables de un proyecto.
 *
 * No toca is_published, is_featured ni display_order: esos se manejan desde el
 * listado, donde el efecto sobre la grilla se ve en contexto. Tampoco toca el
 * slug — ver la nota en AdminProjectEdit.
 */
export interface ProjectPatch {
  name: string;
  hashtag: string | null;
  tagline: Localized<string>;
  description: Localized<string>;
  about: Localized<string> | null;
  location: Localized<string>;
  region_slug: string;
  status: string;
  units: Localized<string> | null;
  tipologias: Localized<string> | null;
  investment: Localized<string> | null;
  highlights: Localized<string[]>;
  hero_image: string;
  logo: string | null;
  brochure_url: string | null;
  progress_url: string | null;
  video_embed: string | null;
  maps_url: string | null;
  gradient_key: string;
  lat: number | null;
  lng: number | null;
}

export function useUpdateProject() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async ({ slug, patch }: { slug: string; patch: ProjectPatch }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(patch)
        .eq("slug", slug)
        .select("slug");

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(
          "No se pudo guardar: la base no dejó modificar este proyecto. Puede ser un problema de permisos."
        );
      }
      return data;
    },
    onSuccess: invalidate,
  });
}

/**
 * Crea un proyecto con lo mínimo indispensable.
 *
 * Arranca despublicado y sin imagen: las fotos se suben después, cuando ya
 * existe la carpeta del slug en Storage. El resto de los campos toman los
 * defaults de la tabla.
 */
export interface NewProject {
  slug: string;
  name: string;
  tagline: Localized<string>;
  description: Localized<string>;
  location: Localized<string>;
  region_slug: string;
  status: string;
}

export function useCreateProject() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async (project: NewProject) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select("slug");

      if (error) {
        // 23505 es violación de unicidad: el único índice único que puede
        // chocar acá es el del slug.
        if (error.code === "23505") {
          throw new Error(
            `Ya existe un proyecto con la URL «${project.slug}». Elegí otra.`
          );
        }
        throw error;
      }
      if (!data || data.length === 0) {
        throw new Error(
          "No se pudo crear: la base rechazó la operación. Puede ser un problema de permisos."
        );
      }
      return data[0].slug as string;
    },
    onSuccess: invalidate,
  });
}
