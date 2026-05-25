-- =============================================================================
-- Migration: add_message_to_leads
-- Fecha:     2026-05-25
-- Spec:      reference/chatbot-neo-spec.md § 3.1 (actualizado)
-- =============================================================================
-- Agrega columna `message` para el mensaje libre del lead.
-- - El **chatbot Neo** no captura mensaje libre — siempre será NULL.
-- - El **formulario de contacto** sí captura un campo "Mensaje" libre.
-- - El **comercial** en Fase 2 sigue usando `notes` para sus notas internas.
-- =============================================================================

alter table public.leads
  add column message text;

comment on column public.leads.message is
  'Mensaje inicial libre del lead (formulario de contacto). El chatbot no captura mensaje libre.';
