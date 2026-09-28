-- =============================================================================
-- Migration: hero_image_nullable
-- Fecha:     2026-09-28
-- =============================================================================
-- `hero_image` deja de ser obligatoria para poder crear proyectos desde el panel.
--
-- EL NUDO: las imágenes se guardan en `project-images/<slug>/`, así que para
-- subir una hace falta el slug, y el slug existe recién cuando el proyecto está
-- creado. Exigir la imagen en el alta obligaba además a tener la foto lista
-- para poder siquiera bosquejar un proyecto.
--
-- Un proyecto en borrador sin foto todavía es un estado legítimo. La exigencia
-- se mueve al momento de publicar, que es cuando el público lo vería: el panel
-- no deja publicar un proyecto sin imagen principal.
--
-- El público nunca ve un proyecto sin imagen porque sólo ve los publicados:
-- la RLS filtra por `is_published` y la landing además filtra de nuevo.
-- =============================================================================

alter table public.projects
  alter column hero_image drop not null;

comment on column public.projects.hero_image is
  'Puede ser null mientras el proyecto está en borrador. El panel no deja publicar sin ella.';
