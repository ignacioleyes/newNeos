-- =============================================================================
-- Migration: project_images_bucket
-- Fecha:     2026-09-27
-- Fase:      2 — Landing administrable
-- =============================================================================
-- Bucket para las imágenes de los proyectos.
--
-- Hasta ahora las imágenes eran rutas a archivos del repo (`/projects/...`),
-- así que subir una foto nueva de avance de obra requería un desarrollador que
-- la commiteara y redeployara. Para una desarrolladora con obras en curso ese
-- es justamente el contenido que más seguido cambia.
--
-- ORGANIZACIÓN: un directorio por slug de proyecto,
--   project-images/<slug>/<archivo>
-- El panel lista ese directorio para armar la galería de cada proyecto, así que
-- el bucket es la fuente de verdad de "qué imágenes tiene este proyecto". No
-- hay tabla paralela que se pueda desincronizar del contenido real.
--
-- LECTURA PÚBLICA: el bucket es público porque las imágenes se muestran en la
-- landing a visitantes anónimos. No hay nada sensible acá — son renders y fotos
-- de obra destinadas a publicarse.
--
-- ESCRITURA: sólo empleados activos, con la misma condición que el resto del
-- contenido (`is_employee()`). Estar logueado no alcanza.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  -- 10 MB. El plan free admite hasta 50, pero el panel redimensiona antes de
  -- subir y una imagen web bien exportada no llega ni a 1 MB. Un límite bajo
  -- convierte "alguien subió el original de 40 MB de la cámara" en un error
  -- claro en vez de en una página lenta.
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- Policies
-- -----------------------------------------------------------------------------
-- El bucket público ya permite leer por URL directa, pero la policy de SELECT
-- hace falta igual para poder LISTAR el contenido del directorio — que es lo
-- que necesita la galería del panel.
drop policy if exists "Public read project images" on storage.objects;
create policy "Public read project images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Employees upload project images" on storage.objects;
create policy "Employees upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_employee());

drop policy if exists "Employees update project images" on storage.objects;
create policy "Employees update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_employee())
  with check (bucket_id = 'project-images' and public.is_employee());

drop policy if exists "Employees delete project images" on storage.objects;
create policy "Employees delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_employee());
