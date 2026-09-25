-- =============================================================================
-- Migration: add_ping_function
-- Fecha:     2026-09-25
-- =============================================================================
-- Función de keepalive. El free tier de Supabase pausa los proyectos después de
-- ~7 días sin actividad, y el proyecto anterior se perdió justamente por eso.
--
-- El workflow .github/workflows/supabase-keepalive.yml la llama dos veces por
-- semana vía PostgREST (`POST /rest/v1/rpc/ping`). Eso cuenta como actividad
-- del proyecto y evita la pausa.
--
-- Por qué una función y no un `select` sobre `leads`:
--   - `anon` no tiene (ni debe tener) policy de SELECT sobre `leads`
--   - deja explícito para qué existe esto — un GET a /leads en un workflow es
--     confuso de leer seis meses después
--
-- No expone nada: devuelve `now()`, nada más.
-- =============================================================================

create or replace function public.ping()
returns timestamptz
language sql
security invoker
-- search_path vacío: la función no resuelve nombres sin schema, así que no
-- puede ser secuestrada por un objeto plantado en otro schema.
set search_path = ''
as $$ select now() $$;

comment on function public.ping() is
  'Keepalive del free tier — la llama el workflow supabase-keepalive. Devuelve now(), no expone datos.';

-- Grants mínimos: sólo anon ejecuta. Postgres otorga EXECUTE a `public` por
-- default en funciones nuevas, así que hay que revocarlo explícitamente.
revoke all on function public.ping() from public;
grant execute on function public.ping() to anon;
