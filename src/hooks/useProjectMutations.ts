import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { CONTENT_QUERY_KEY } from "./useContent";

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
