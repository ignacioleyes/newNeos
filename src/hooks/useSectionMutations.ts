import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { CONTENT_QUERY_KEY } from "./useContent";
import type { SectionKind } from "../lib/sections";

/**
 * Mutaciones del panel sobre las secciones de una página de detalle.
 *
 * Igual que las de proyectos: todas invalidan la query `content`, que es la
 * misma que usa la landing, así que el sitio refleja el cambio sin
 * coordinación extra.
 */

function useInvalidateContent() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
}

/** Igual que en proyectos: un 204 con cero filas es RLS, no éxito. */
function assertTouched(rows: unknown[] | null, what: string) {
  if (!rows || rows.length === 0) {
    throw new Error(
      `No se pudo ${what}: la base no dejó hacer el cambio. Puede ser un problema de permisos.`
    );
  }
}

export function useAddSection() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async ({
      projectId,
      kind,
      position,
      data,
    }: {
      projectId: string;
      kind: SectionKind;
      position: number;
      data: unknown;
    }) => {
      const { data: rows, error } = await supabase
        .from("project_sections")
        .insert({ project_id: projectId, kind, position, data })
        .select("id");
      if (error) throw error;
      assertTouched(rows, "agregar la sección");
      return rows![0].id as string;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateSection() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async ({
      id,
      data,
      isVisible,
    }: {
      id: string;
      data?: unknown;
      isVisible?: boolean;
    }) => {
      const patch: Record<string, unknown> = {};
      if (data !== undefined) patch.data = data;
      if (isVisible !== undefined) patch.is_visible = isVisible;

      const { data: rows, error } = await supabase
        .from("project_sections")
        .update(patch)
        .eq("id", id)
        .select("id");
      if (error) throw error;
      assertTouched(rows, "guardar la sección");
    },
    onSuccess: invalidate,
  });
}

export function useDeleteSection() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: rows, error } = await supabase
        .from("project_sections")
        .delete()
        .eq("id", id)
        .select("id");
      if (error) throw error;
      assertTouched(rows, "borrar la sección");
    },
    onSuccess: invalidate,
  });
}

export function useReorderSections() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async (idsInOrder: string[]) => {
      const { error } = await supabase.rpc("reorder_project_sections", {
        p_ids: idsInOrder,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}
