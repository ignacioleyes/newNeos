-- =============================================================================
-- Migration: create_projects_schema
-- Fecha:     2026-09-26
-- Fase:      2 — Landing administrable
-- =============================================================================
-- Mueve el contenido de la landing (hoy hardcodeado en src/data/*.ts) a la base,
-- para que NEOS pueda administrarlo desde un panel.
--
--   regions          — las 3 zonas, con su config de mapa
--   projects         — los proyectos (listado + datos base)
--   project_sections — las secciones de la página de detalle, ordenables
--
-- Decisiones de modelado, con su porqué:
--
-- * Textos localizados como jsonb {es,en} en vez de columnas _es/_en. El front
--   ya los modela como Localized<T> y los consume con tr(); así el mapeo es
--   casi identidad y no hay que tocar componentes. Se validan con checks.
--
-- * `status` sin su `statusLabel`. La etiqueta se deriva del enum en el front.
--   Guardar las dos garantiza que tarde o temprano queden inconsistentes.
--
-- * `gradient_key` en vez de las clases de Tailwind literales. Tailwind purga
--   las clases que no encuentra en el código fuente, así que un gradiente
--   inventado desde el panel NO existiría en el CSS. La key mapea a un preset
--   definido en el front.
--
-- * Los dots del mapa desaparecen como concepto: eran 1:1 con los proyectos.
--   Ahora cada proyecto tiene lat/lng y el mapa de su región los deriva. Un
--   proyecto nuevo aparece en el mapa sin que nadie cargue nada aparte.
--
-- * El conteo de proyectos por región también se deriva (vista al final).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Validadores de los jsonb localizados
-- -----------------------------------------------------------------------------
-- Sin esto, un payload mal formado entra igual y rompe recién en el navegador.

create or replace function public.is_localized_text(v jsonb)
returns boolean language sql immutable set search_path = '' as $fn$
  select v is null or (
    jsonb_typeof(v) = 'object'
    and v ? 'es' and v ? 'en'
    and jsonb_typeof(v -> 'es') = 'string'
    and jsonb_typeof(v -> 'en') = 'string'
  )
$fn$;

create or replace function public.is_localized_list(v jsonb)
returns boolean language sql immutable set search_path = '' as $fn$
  select v is null or (
    jsonb_typeof(v) = 'object'
    and v ? 'es' and v ? 'en'
    and jsonb_typeof(v -> 'es') = 'array'
    and jsonb_typeof(v -> 'en') = 'array'
  )
$fn$;

-- -----------------------------------------------------------------------------
-- regions
-- -----------------------------------------------------------------------------
create table public.regions (
  slug            text primary key,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  name            text not null,
  description     jsonb not null check (public.is_localized_text(description)),

  -- Centro nominal de la región (se usa fuera del mapa)
  lat             double precision not null,
  lng             double precision not null,

  -- Encuadre inicial del mapa de Leaflet
  map_center_lat  double precision not null,
  map_center_lng  double precision not null,
  map_zoom        integer not null default 11 check (map_zoom between 1 and 20),

  gradient_key    text not null default 'rose'
                  check (gradient_key in ('rose', 'amber', 'fuchsia')),
  display_order   integer not null default 999
);

comment on table public.regions is
  'Zonas donde NEOS desarrolla. El conteo de proyectos NO se guarda: ver la vista regions_with_counts.';

-- -----------------------------------------------------------------------------
-- projects
-- -----------------------------------------------------------------------------
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  slug          text not null unique,
  name          text not null,
  hashtag       text,

  tagline       jsonb not null check (public.is_localized_text(tagline)),
  description   jsonb not null check (public.is_localized_text(description)),
  about         jsonb          check (public.is_localized_text(about)),
  location      jsonb not null check (public.is_localized_text(location)),

  region_slug   text not null references public.regions(slug) on update cascade,

  status        text not null default 'en-obra'
                check (status in ('anteproyecto', 'en-obra', 'lanzamiento', 'finalizado')),

  units         jsonb check (public.is_localized_text(units)),
  tipologias    jsonb check (public.is_localized_text(tipologias)),
  investment    jsonb check (public.is_localized_text(investment)),

  -- [{key, label:{es,en}}] — `key` tiene que salir del set que conoce
  -- AmenityIcon, si no el ícono cae en el círculo genérico del fallback.
  amenities     jsonb not null default '[]'::jsonb
                check (jsonb_typeof(amenities) = 'array'),
  services      jsonb check (public.is_localized_list(services)),
  highlights    jsonb not null default '{"es":[],"en":[]}'::jsonb
                check (public.is_localized_list(highlights)),

  hero_image    text not null,
  logo          text,
  brochure_url  text,
  progress_url  text,
  video_embed   text,
  maps_url      text,

  gradient_key  text not null default 'amber'
                check (gradient_key in ('amber', 'pink', 'orange', 'emerald', 'sky')),

  -- Posición en el mapa de su región. Reemplaza los dots de regions.ts.
  lat           double precision,
  lng           double precision,

  -- display_order manda: los primeros publicados arman la grilla de la home,
  -- el resto cae en la lista de "Trayectoria".
  display_order integer not null default 999,
  is_featured   boolean not null default false,
  is_published  boolean not null default false,

  -- lat y lng van juntos o no van
  constraint projects_coords_complete
    check ((lat is null) = (lng is null))
);

comment on column public.projects.is_featured is
  'El que ocupa el card grande 2x2 de la home. Solo puede haber uno (ver índice projects_one_featured).';

create index projects_region_idx    on public.projects (region_slug);
create index projects_published_idx on public.projects (is_published, display_order);

-- Como máximo un destacado: el índice es único sobre las filas donde is_featured
-- es true, así que una segunda fila destacada choca.
create unique index projects_one_featured
  on public.projects (is_featured) where is_featured;

-- -----------------------------------------------------------------------------
-- project_sections
-- -----------------------------------------------------------------------------
-- Las páginas de detalle comparten 7 secciones y difieren en 2, pero además
-- difieren en el orden (Chaquíes pone amenities antes del pull quote; Neweken
-- pone el quote antes del master plan). Por eso son filas ordenables y no
-- columnas fijas.
create table public.project_sections (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  project_id  uuid not null references public.projects(id) on delete cascade,

  kind        text not null check (kind in (
                'hero', 'specs', 'what_is', 'context',
                'amenities', 'pull_quote', 'masterplan', 'gallery', 'cta'
              )),
  position    integer not null default 0,
  is_visible  boolean not null default true,

  -- Payload propio de cada kind. Los títulos usan marcador [entre corchetes]
  -- para el fragmento resaltado, en vez de partirse en titleA/highlight/titleB.
  data        jsonb not null default '{}'::jsonb
              check (jsonb_typeof(data) = 'object')
);

comment on table public.project_sections is
  'Secciones de la página de detalle. Una sección ausente es simplemente una fila que no existe.';

create index project_sections_project_idx on public.project_sections (project_id, position);

-- -----------------------------------------------------------------------------
-- updated_at (reusa el trigger creado en la migración de leads)
-- -----------------------------------------------------------------------------
create trigger regions_set_updated_at before update on public.regions
  for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger project_sections_set_updated_at before update on public.project_sections
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Conteo derivado de proyectos por región
-- -----------------------------------------------------------------------------
-- regions.ts lo tenía a mano (2, 2, 1). Se desincroniza el día uno de que
-- alguien agregue un proyecto desde el panel.
create view public.regions_with_counts
  with (security_invoker = true) as
  select r.*,
         (select count(*) from public.projects p
           where p.region_slug = r.slug and p.is_published) as projects_count
    from public.regions r;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
-- La anon key viaja en el bundle del navegador, así que la RLS es lo único que
-- separa "ver la landing" de "editar la landing".
alter table public.regions          enable row level security;
alter table public.projects         enable row level security;
alter table public.project_sections enable row level security;

-- Público: lee regiones (son metadata de mapa, no hay nada sensible)
create policy "Anon can read regions"
  on public.regions for select to anon using (true);

-- Público: lee SOLO proyectos publicados
create policy "Anon can read published projects"
  on public.projects for select to anon using (is_published);

-- Público: lee secciones visibles de proyectos publicados
create policy "Anon can read visible sections of published projects"
  on public.project_sections for select to anon
  using (
    is_visible and exists (
      select 1 from public.projects p
      where p.id = project_sections.project_id and p.is_published
    )
  );

-- Empleados autenticados: control total. El refinamiento por rol llega con la
-- tabla employees (ver el roadmap en supabase/README.md).
create policy "Authenticated manage regions"
  on public.regions for all to authenticated using (true) with check (true);
create policy "Authenticated manage projects"
  on public.projects for all to authenticated using (true) with check (true);
create policy "Authenticated manage sections"
  on public.project_sections for all to authenticated using (true) with check (true);
