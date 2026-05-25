-- =============================================================================
-- Migration: create_leads_table
-- Fecha:     2026-05-25
-- Fase:      1 — Lead capture (chatbot Neo)
-- Spec:      reference/chatbot-neo-spec.md § 3.1
-- =============================================================================
-- Crea la tabla `leads` que almacena todos los leads captados por:
--   - El chatbot Neo (source = 'chatbot')
--   - El formulario de contacto (source = 'contact-form')
--   - WhatsApp directo (source = 'whatsapp', tracking manual)
--
-- Incluye RLS habilitado con policies para:
--   - anon: puede INSERT (chatbot público)
--   - authenticated: puede SELECT y UPDATE (empleados NEOS en Fase 2)
-- =============================================================================

create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Tabla principal
-- -----------------------------------------------------------------------------
create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  -- Datos del lead (capturados por Neo o por contact form)
  name            text not null,
  email           text,
  phone           text,
  interest        text,           -- 'inversion' | 'vivienda' | 'info'
  region          text,           -- 'cafayate' | 'vaca-muerta' | 'salta-capital' | 'otro'
  project_slug    text,           -- ref a projects.ts (chaquies, neweken, mercatus, ...)

  -- Trazabilidad
  source          text default 'chatbot',  -- 'chatbot' | 'contact-form' | 'whatsapp'
  lang            text default 'es',       -- 'es' | 'en'
  user_agent      text,
  referrer        text,

  -- Pipeline (se usa en Fase 2)
  status          text default 'new',      -- 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
  assigned_to     uuid,                    -- FK a auth.users (Fase 2)
  notes           text,

  -- Conversación completa de Neo (estructura en spec § 3.2)
  conversation    jsonb
);

comment on table public.leads is
  'Leads captados desde la landing — chatbot Neo, formulario de contacto, o WhatsApp directo.';

-- -----------------------------------------------------------------------------
-- Índices
-- -----------------------------------------------------------------------------
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx     on public.leads (status);
create index leads_email_idx      on public.leads (email);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.leads enable row level security;

-- El chatbot público inserta como rol anon (la anon key viaja al navegador).
-- Es seguro porque sólo permite crear leads, no leerlos ni editarlos.
create policy "Anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Empleados autenticados (Fase 2) leen y actualizan leads.
create policy "Authenticated can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated can update leads"
  on public.leads for update
  to authenticated
  using (true);
