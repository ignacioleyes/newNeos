-- =============================================================================
-- Migration: project_admin_rpcs
-- Fecha:     2026-09-26
-- Fase:      2 — Panel de administración
-- =============================================================================
-- Dos operaciones del panel que no se pueden hacer con un UPDATE suelto desde
-- el cliente, porque necesitan varios cambios en la misma transacción.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Cambiar el destacado
-- -----------------------------------------------------------------------------
-- El índice `projects_one_featured` deja como máximo un destacado. Desde el
-- cliente habría que apagar el anterior y prender el nuevo en dos requests, y
-- entre las dos la base queda sin destacado — o, si fallara la segunda, así se
-- quedaría. Adentro de una función es una sola transacción: o pasan las dos o
-- no pasa ninguna.
create or replace function public.set_featured_project(p_slug text)
returns void
language plpgsql
security invoker
set search_path = ''
as $fn$
begin
  if not exists (select 1 from public.projects where slug = p_slug) then
    raise exception 'No existe el proyecto %', p_slug using errcode = 'no_data_found';
  end if;

  update public.projects set is_featured = false
   where is_featured and slug <> p_slug;

  update public.projects set is_featured = true
   where slug = p_slug;
end;
$fn$;

comment on function public.set_featured_project(text) is
  'Mueve el destacado a un proyecto, apagando el anterior en la misma transacción.';

-- -----------------------------------------------------------------------------
-- Reordenar
-- -----------------------------------------------------------------------------
-- Recibe los slugs en el orden deseado y reescribe display_order de una. Hacerlo
-- desde el cliente serían N requests, y un corte en el medio dejaría la grilla
-- con el orden mezclado.
create or replace function public.reorder_projects(p_slugs text[])
returns void
language plpgsql
security invoker
set search_path = ''
as $fn$
begin
  update public.projects p
     set display_order = o.ord
    from unnest(p_slugs) with ordinality as o(slug, ord)
   where p.slug = o.slug;
end;
$fn$;

comment on function public.reorder_projects(text[]) is
  'Reescribe display_order según el orden del array de slugs recibido.';

-- -----------------------------------------------------------------------------
-- Permisos
-- -----------------------------------------------------------------------------
-- SECURITY INVOKER: las funciones corren con los permisos de quien llama, así
-- que la RLS de `projects` sigue aplicando. Un anon que las invoque no cambia
-- nada, porque no tiene policy de UPDATE.
revoke all on function public.set_featured_project(text) from public;
revoke all on function public.reorder_projects(text[]) from public;
grant execute on function public.set_featured_project(text) to authenticated;
grant execute on function public.reorder_projects(text[]) to authenticated;
