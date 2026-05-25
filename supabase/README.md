# Supabase — NEOS

Carpeta de referencia con toda la infraestructura backend del proyecto en Supabase.

> **Cómo aplicar cambios**: los scripts SQL se ejecutan manualmente desde el **SQL Editor** del dashboard de Supabase (`https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy/sql`). En el futuro podemos conectar el Supabase CLI para aplicar migraciones automáticamente con `supabase db push`.

---

## Estructura

```
supabase/
├── README.md                    # Este archivo
├── migrations/                  # Scripts SQL versionados (orden cronológico)
│   ├── 20260525120000_create_leads_table.sql
│   └── 20260525130000_add_message_to_leads.sql
└── functions/                   # Edge Functions (Deno) — diferidas, ver § Edge Functions
    └── _shared/
        ├── emailTemplate.ts     # Template HTML del email (no se usa hoy)
        └── email-preview.html   # Preview visual del template
```

---

## Migraciones

Las migraciones se nombran con el formato `YYYYMMDDHHMMSS_descripcion.sql` (convención del Supabase CLI). Se ejecutan **en orden**.

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `20260525120000_create_leads_table.sql` | Tabla `leads` con RLS, índices y policies base | ✅ Ejecutada |
| `20260525130000_add_message_to_leads.sql` | Agrega columna `message` para mensajes libres del formulario de contacto | ⏳ Pendiente |

### Cómo ejecutar una migración manualmente

1. Abrir el [SQL Editor](https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy/sql) de Supabase
2. Click en **New query**
3. Pegar el contenido del archivo `.sql`
4. Click en **Run** (Ctrl+Enter)
5. Verificar en el log que dice `Success. No rows returned.`

---

## Arquitectura actual (Fase 1 — Lead capture)

### Tablas

#### `leads`

Captura todos los leads. **Tiene 2 fuentes de entrada**:
- **Chatbot Neo** (`source = "chatbot"`) — conversación guiada, incluye `conversation` JSONB con los steps
- **Formulario de contacto** (`source = "contact-form"`) — formulario tradicional, incluye `message` libre

| Columna | Tipo | Descripción | Usado por |
|---------|------|-------------|-----------|
| `id` | `uuid` | PK, auto-generado | ambos |
| `created_at` | `timestamptz` | Auto | ambos |
| `updated_at` | `timestamptz` | Auto (trigger) | ambos |
| `name` | `text` | Obligatorio | ambos |
| `email` | `text` | Opcional (al menos uno: email o phone) | ambos |
| `phone` | `text` | Opcional | ambos |
| `message` | `text` | Mensaje libre del lead | **solo form** |
| `interest` | `text` | `inversion` \| `vivienda` \| `info` | solo chatbot |
| `region` | `text` | `cafayate` \| `vaca-muerta` \| `salta-capital` \| `otro` | solo chatbot |
| `project_slug` | `text` | Slug del proyecto (`chaquies`, `neweken`, etc.) | solo chatbot |
| `source` | `text` | `chatbot` (default) \| `contact-form` \| `whatsapp` | ambos |
| `lang` | `text` | `es` (default) \| `en` | ambos |
| `user_agent` | `text` | Trazabilidad | ambos |
| `referrer` | `text` | Trazabilidad | ambos |
| `status` | `text` | `new` (default) \| `contacted` \| `qualified` \| `won` \| `lost` | ambos (lifecycle) |
| `assigned_to` | `uuid` | FK a `auth.users` (se usa en Fase 2) | Fase 2 |
| `notes` | `text` | Notas internas del comercial | Fase 2 |
| `conversation` | `jsonb` | Log completo de la conversación con Neo | solo chatbot |

### Row Level Security (RLS)

| Policy | Rol | Operación | Condición |
|--------|-----|-----------|-----------|
| `Anon can insert leads` | `anon` | INSERT | siempre permitido |
| `Authenticated can read leads` | `authenticated` | SELECT | siempre permitido |
| `Authenticated can update leads` | `authenticated` | UPDATE | siempre permitido |

> **¿Por qué `anon` puede insertar?** Porque el chatbot público corre con la `anon` key (que viaja al navegador). Aceptar INSERT desde anon es seguro porque sólo permite crear leads, no leerlos ni editarlos.

### Edge Functions

**Diferidas a propósito.** Originalmente había una función `send-lead-notification` planeada para mandar email vía Resend en cada lead nuevo. Se descartó en favor de **notificaciones in-app vía Supabase Realtime en Fase 2** — refuerza el pitch del SaaS que se le va a vender a NEOS. Ver [§ 9 del spec del chatbot](../reference/chatbot-neo-spec.md#9-cambio-de-arquitectura--sin-email-externo-realtime-para-notificaciones).

El template HTML del email quedó escrito en `functions/_shared/emailTemplate.ts` por si en el futuro se quiere reactivar — pero hoy no se deploya nada.

### Realtime (Fase 2)

En lugar de email, las notificaciones de nuevos leads van a ir vía **Supabase Realtime**. El cliente de la app interna se suscribe a `INSERT` sobre `public.leads`:

```ts
const channel = supabase
  .channel('leads-changes')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'leads' },
    (payload) => showToast(payload.new)
  )
  .subscribe();
```

Latencia esperada: **< 1 segundo**. Free tier incluye 200 conexiones concurrentes (sobrado para el equipo NEOS).

### Variables de entorno (frontend)

En `.env.local` (gitignored):

```
VITE_SUPABASE_URL=https://slgrwwgmfrrqaludqbhy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Roadmap de migraciones futuras

### Fase 2 — Sistema de gestión interno (CRM)

| Archivo | Descripción |
|---------|-------------|
| `xxxxxxxxxx_employees_table.sql` | Tabla `employees` con roles (`admin`, `vendedor`) — extiende `auth.users` |
| `xxxxxxxxxx_leads_rls_per_role.sql` | Refinar RLS de `leads`: admin ve todo, vendedor sólo sus asignados |
| `xxxxxxxxxx_lead_activity_log.sql` | Tabla `lead_activity` con timeline de interacciones (llamadas, emails, cambios de estado) |
| `xxxxxxxxxx_lead_notes_table.sql` | Tabla `lead_notes` para historial de notas con autor |

### Fase 3 — SaaS multi-tenant

| Archivo | Descripción |
|---------|-------------|
| `xxxxxxxxxx_workspaces_table.sql` | Tabla `workspaces` para multi-tenancy |
| `xxxxxxxxxx_pipelines_table.sql` | Pipelines configurables por workspace |
| `xxxxxxxxxx_whatsapp_messages.sql` | Conversaciones de WhatsApp Business API |
| `xxxxxxxxxx_lead_scoring_rules.sql` | Reglas configurables de scoring de leads |

---

## Convenciones

- **Nombres de tabla**: plural en `snake_case` (`leads`, `employees`, `lead_notes`)
- **PKs**: siempre `uuid` con `gen_random_uuid()`
- **Timestamps**: `created_at` + `updated_at` con `timestamptz default now()`
- **Enums**: por ahora `text` con check constraints futuros (más fácil de evolucionar que tipos enum nativos de Postgres)
- **RLS**: **siempre** habilitado en tablas con datos sensibles. Mejor restrictivo y abrir, que abierto y olvidar cerrar.

---

## Links útiles

- [Dashboard](https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy)
- [SQL Editor](https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy/sql)
- [Table Editor](https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy/editor)
- [Auth](https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy/auth/users)
- [Edge Functions](https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy/functions)
- [Database Webhooks](https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy/database/hooks)
- [Spec completa del chatbot Neo](../reference/chatbot-neo-spec.md)
