-- =============================================================================
-- Migration: employees_and_rls_hardening
-- Fecha:     2026-09-26
-- Fase:      2 — Panel de administración
-- =============================================================================
-- Cierra un agujero real y crea la base de roles del panel.
--
-- EL PROBLEMA
-- Las policies de la migración anterior dicen `to authenticated`. Supabase Auth
-- permite registro público con la anon key salvo que se desactive a mano, y la
-- anon key viaja en el bundle del navegador. O sea: cualquiera podía
-- registrarse solo y quedar habilitado para editar la landing.
--
-- LA SOLUCIÓN
-- Escribir no depende de "estar logueado" sino de "figurar en `employees` y
-- estar activo". Un registro espontáneo crea un usuario de auth que no está en
-- `employees`, y por lo tanto no puede escribir nada.
--
-- Igual conviene desactivar el registro público en el dashboard
-- (Authentication → Sign In / Providers → Allow new users to sign up).
-- Son dos defensas para la misma puerta; esta es la que no depende de que
-- alguien no toque un switch por error.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- employees
-- -----------------------------------------------------------------------------
create table public.employees (
  id          uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  email       text not null,
  name        text,
  role        text not null default 'editor'
              check (role in ('admin', 'editor')),
  is_active   boolean not null default true
);

comment on table public.employees is
  'Gente de NEOS habilitada a usar el panel. Estar en auth.users NO alcanza para escribir: hay que estar acá y activo.';
comment on column public.employees.role is
  'admin: además gestiona empleados. editor: gestiona contenido.';

create trigger employees_set_updated_at before update on public.employees
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------
-- SECURITY DEFINER porque las policies de `employees` consultan la propia tabla
-- y eso sería recursivo. La función corre con los permisos del dueño y saltea
-- la RLS; no recibe parámetros y sólo mira al usuario del token, así que no hay
-- forma de preguntar por otro.
create or replace function public.is_employee()
returns boolean
language sql
stable
security definer
set search_path = ''
as $fn$
  select exists (
    select 1 from public.employees e
    where e.id = (select auth.uid()) and e.is_active
  )
$fn$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $fn$
  select exists (
    select 1 from public.employees e
    where e.id = (select auth.uid()) and e.is_active and e.role = 'admin'
  )
$fn$;

revoke all on function public.is_employee() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_employee() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- RLS de employees
-- -----------------------------------------------------------------------------
alter table public.employees enable row level security;

-- Cada uno se ve a sí mismo: el panel necesita saber tu rol al entrar.
create policy "Employees read self"
  on public.employees for select to authenticated
  using (id = (select auth.uid()));

-- Los admin ven y gestionan a todos.
create policy "Admins read all employees"
  on public.employees for select to authenticated
  using (public.is_admin());

create policy "Admins manage employees"
  on public.employees for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Reemplazo de las policies de contenido
-- -----------------------------------------------------------------------------
-- Antes: cualquier `authenticated`. Ahora: sólo empleados activos.
drop policy if exists "Authenticated manage regions"  on public.regions;
drop policy if exists "Authenticated manage projects" on public.projects;
drop policy if exists "Authenticated manage sections" on public.project_sections;

create policy "Employees manage regions"
  on public.regions for all to authenticated
  using (public.is_employee()) with check (public.is_employee());

create policy "Employees manage projects"
  on public.projects for all to authenticated
  using (public.is_employee()) with check (public.is_employee());

create policy "Employees manage sections"
  on public.project_sections for all to authenticated
  using (public.is_employee()) with check (public.is_employee());

-- -----------------------------------------------------------------------------
-- Leads (misma lógica)
-- -----------------------------------------------------------------------------
-- La tabla de leads tiene datos personales de gente que dejó sus contactos.
-- Que un registro espontáneo pudiera leerlos era el agujero más grave de todos.
drop policy if exists "Authenticated can read leads"   on public.leads;
drop policy if exists "Authenticated can update leads" on public.leads;

create policy "Employees read leads"
  on public.leads for select to authenticated
  using (public.is_employee());

create policy "Employees update leads"
  on public.leads for update to authenticated
  using (public.is_employee()) with check (public.is_employee());
