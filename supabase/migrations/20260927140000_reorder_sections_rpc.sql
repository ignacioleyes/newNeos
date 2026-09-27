-- =============================================================================
-- Migration: reorder_sections_rpc
-- Fecha:     2026-09-27
-- =============================================================================
-- Reordenar las secciones de una página desde el cliente serían N requests, y
-- un corte en el medio dejaría la página con el orden mezclado. Adentro de una
-- función es una sola transacción.
--
-- SECURITY INVOKER: corre con los permisos de quien llama, así que la RLS de
-- project_sections sigue aplicando. Un anon que la invoque no cambia nada.
-- =============================================================================

create or replace function public.reorder_project_sections(p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $fn$
begin
  update public.project_sections s
     set position = o.ord
    from unnest(p_ids) with ordinality as o(id, ord)
   where s.id = o.id;
end;
$fn$;

comment on function public.reorder_project_sections(uuid[]) is
  'Reescribe `position` según el orden del array de ids recibido.';

-- Las default privileges de Supabase le dan EXECUTE a anon sobre toda función
-- nueva del schema public; revocar de PUBLIC no alcanza. Ver la migración
-- 20260926234500 para el detalle.
revoke all on function public.reorder_project_sections(uuid[]) from public;
revoke all on function public.reorder_project_sections(uuid[]) from anon;
grant execute on function public.reorder_project_sections(uuid[]) to authenticated;
