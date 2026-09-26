-- =============================================================================
-- Migration: revoke_admin_functions_from_anon
-- Fecha:     2026-09-26
-- =============================================================================
-- Corrige un permiso que las migraciones anteriores creyeron haber cerrado.
--
-- EL ERROR
-- Escribimos `revoke all on function ... from public` pensando que eso dejaba
-- la función sólo para `authenticated`. No es así: Supabase tiene default
-- privileges que, al crear cualquier función en `public`, otorgan EXECUTE
-- explícitamente a `anon`, `authenticated` y `service_role`. Revocar de PUBLIC
-- no toca esas concesiones nominales, así que `anon` quedó pudiendo ejecutar
-- is_employee(), is_admin(), set_featured_project() y reorder_projects().
--
-- EL IMPACTO REAL ERA NULO, pero conviene entender por qué:
--   - set_featured_project y reorder_projects son SECURITY INVOKER, así que la
--     RLS de `projects` igual rechazaba los UPDATE. Verificado: llamándolas con
--     la anon key, el destacado no se movía.
--   - is_employee() e is_admin() miran auth.uid(), que para anon es null, así
--     que devolvían false sin filtrar nada.
--
-- POR QUÉ ARREGLARLO IGUAL
-- Porque la protección dependía de un detalle ajeno (que siguieran siendo
-- INVOKER). El día que alguien pase una de estas a SECURITY DEFINER —algo
-- razonable de hacer— `anon` pasaría a tener poder de escritura sin que nadie
-- lo note. El permiso tiene que ser correcto por sí mismo.
--
-- NOTA: no se toca `ping()`. Esa SÍ tiene que ser ejecutable por anon: la llama
-- el workflow de keepalive con la publishable key.
-- =============================================================================

revoke all on function public.is_employee()                from anon;
revoke all on function public.is_admin()                   from anon;
revoke all on function public.set_featured_project(text)   from anon;
revoke all on function public.reorder_projects(text[])     from anon;

-- Las policies que llaman a is_employee() son todas `to authenticated`, así que
-- anon nunca evalúa esas expresiones y no necesita el permiso. Las suyas
-- (leer publicados, insertar leads) no invocan funciones.
