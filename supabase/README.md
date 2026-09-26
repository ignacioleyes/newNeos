# Supabase — NEOS

Carpeta de referencia con toda la infraestructura backend del proyecto en Supabase.

> **Cómo aplicar cambios**: con el **Supabase CLI**, instalado como devDependency del proyecto. Las migraciones se aplican con `yarn db:push` — no hace falta pegar SQL a mano en el dashboard.

## Comandos

| Comando | Qué hace |
|---------|----------|
| `yarn db:status` | Compara migraciones locales vs. las aplicadas en el remoto |
| `yarn db:push` | Aplica al remoto las migraciones que faltan (agregar `--dry-run` para ver qué haría antes) |
| `yarn db:diff` | Detecta cambios hechos a mano en el dashboard que todavía no están en ninguna migración |
| `yarn supabase db query --linked "<sql>"` | Corre SQL contra el remoto — para inspección o arreglos puntuales, **no** para cambios de schema (esos van como migración) |

El CLI se autentica con el access token del usuario (guardado en `%APPDATA%\supabase`, fuera del repo) y provisiona un rol temporal por conexión, así que **no hace falta la database password**.

> En PowerShell con execution policy `Restricted`, el shim `yarn.ps1` está bloqueado: usá `yarn.cmd` en lugar de `yarn` (a los `.cmd` no les aplica), o corré los comandos desde `cmd`.

---

## Estructura

```
supabase/
├── README.md                    # Este archivo
├── config.toml                  # Config del CLI (generado por `supabase init`)
├── migrations/                  # Scripts SQL versionados (orden cronológico)
│   ├── 20260525120000_create_leads_table.sql
│   ├── 20260525130000_add_message_to_leads.sql
│   └── 20260925150000_add_ping_function.sql
└── functions/                   # Edge Functions (Deno) — diferidas, ver § Edge Functions
    └── _shared/
        ├── emailTemplate.ts     # Template HTML del email (no se usa hoy)
        └── email-preview.html   # Preview visual del template
```

`.temp/` también vive acá (estado local del CLI, gitignoreado).

---

## Bootstrappear un proyecto nuevo desde cero

El free tier de Supabase **pausa los proyectos por inactividad**, y un proyecto pausado mucho tiempo se termina perdiendo. Así se perdió el original. Si hay que recrearlo:

1. Crear el proyecto en [database.new](https://database.new) — región **South America (São Paulo)**
2. `yarn supabase login` y `yarn supabase link --project-ref <ref-nuevo>`
3. `yarn db:push` — aplica todas las migraciones en orden
4. Settings → API Keys → copiar el Project URL y la publishable key a `.env.local`
5. Actualizar el project ref en los links de este README y en los secrets del repo (ver § Keepalive)

### Si la base ya tiene schema aplicado a mano

Cuando el schema se cargó por fuera del CLI, `supabase_migrations.schema_migrations` queda vacío y `db push` intenta correr las migraciones desde la primera — rompiendo con *"relation already exists"*. La salida es marcarlas como aplicadas **sin ejecutarlas**:

```
yarn supabase migration repair --status applied 20260525120000 20260525130000
```

Es exactamente lo que hubo que hacer al recrear el proyecto en 2026-09-25, porque la tabla `leads` se había cargado a mano desde el SQL Editor.

### Divergencia cosmética en el orden de columnas

En el proyecto actual `message` quedó en la posición 7 de la tabla, porque el script consolidado con el que se cargó la declaraba inline entre `phone` e `interest`. Las migraciones producen otra cosa: `20260525130000` hace `alter table ... add column`, que la dejaría al final (posición 18). O sea que una base creada con `db push` desde cero no va a ser byte-por-byte igual a esta.

No afecta nada — ni la app ni PostgREST dependen del orden de columnas, siempre se referencian por nombre. Se documenta para que no desconcierte si algún día un `db diff` lo reporta. Confirmarlo requiere Docker (`db diff` levanta una shadow DB local), que hoy no está instalado.

---

## Keepalive — que no se vuelva a pausar

El free tier pausa los proyectos después de **~7 días sin actividad**, y un proyecto pausado mucho tiempo se termina borrando. Así se perdió el proyecto original (`slgrwwgmfrrqaludqbhy`).

La defensa es [`.github/workflows/supabase-keepalive.yml`](../.github/workflows/supabase-keepalive.yml): **lunes y jueves 12:00 UTC** le pega a `public.ping()` vía PostgREST. Gaps de 3 y 4 días, así que si un run falla el siguiente llega a tiempo.

> ✅ **Activo desde 2026-09-26.** Primer run verificado en verde. Los pasos de abajo son para cuando haya que rearmarlo en un proyecto nuevo.

**Setup (una sola vez, por proyecto):**

1. Aplicar la migración que crea `ping()` — entra con `yarn db:push`
2. Repo → Settings → Secrets and variables → Actions → agregar:
   - `SUPABASE_URL` → la URL del proyecto (hoy `https://ecmlccnxzgajozsrnbjn.supabase.co`)
   - `SUPABASE_ANON_KEY` → la publishable key
3. Actions → *Supabase keepalive* → **Run workflow**, para verificar que da verde sin esperar al lunes

Los secrets van en **GitHub**, no en Supabase: el workflow corre en los servidores de GitHub y no tiene acceso a `.env.local`.

### Dos límites que hay que tener presentes

> ⚠️ **GitHub desactiva los cron de un repo después de 60 días sin commits.** Manda un mail antes de hacerlo, con un botón para reactivarlo. Si el proyecto va a quedar quieto más de dos meses, el cron no te salva solo — hay que reactivarlo cuando avise.

> ⚠️ **El cron previene la pausa, no la revierte.** Si el proyecto ya está pausado, los pings fallan con 5xx y hay que reactivarlo a mano desde el dashboard. El workflow falla ruidosamente en ese caso justamente para que te enteres.

---

## Migraciones

Las migraciones se nombran con el formato `YYYYMMDDHHMMSS_descripcion.sql` (convención del Supabase CLI). Se ejecutan **en orden**.

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `20260525120000_create_leads_table.sql` | Tabla `leads` con RLS, índices y policies base | ✅ Ejecutada |
| `20260525130000_add_message_to_leads.sql` | Agrega columna `message` para mensajes libres del formulario de contacto | ✅ Ejecutada |
| `20260925150000_add_ping_function.sql` | Función `ping()` para el keepalive del free tier | ✅ Ejecutada |
| `20260926200000_create_projects_schema.sql` | `regions`, `projects`, `project_sections` + RLS — landing administrable | ✅ Ejecutada |
| `20260926200100_seed_projects_from_source.sql` | Carga inicial de las 3 regiones y los 5 proyectos | ✅ Ejecutada |

> En el proyecto actual (`ecmlccnxzgajozsrnbjn`, creado 2026-09-25) las dos primeras se aplicaron juntas a mano en el SQL Editor y después se registraron con `migration repair`; la tercera ya entró por `db push`. `yarn db:status` es la fuente de verdad — esta tabla es para leer el historial de un vistazo.

### Cómo ejecutar una migración manualmente

1. Abrir el [SQL Editor](https://supabase.com/dashboard/project/ecmlccnxzgajozsrnbjn/sql) de Supabase
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

> ⚠️ **Gotcha: nunca pidas la fila de vuelta en el insert.** Como `anon` no tiene policy de SELECT, un `INSERT ... RETURNING` falla con `42501 new row violates row-level security policy` — aunque la policy de INSERT esté perfecta. En la práctica: `supabase.from("leads").insert(...)` funciona, pero agregarle `.select()` **rompe**. El error es engañoso porque culpa al INSERT cuando en realidad lo que falla es la lectura del `RETURNING`.

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

En `.env.local` (gitignored por la regla `*.local`):

```
VITE_SUPABASE_URL=https://ecmlccnxzgajozsrnbjn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

Los proyectos nuevos de Supabase usan el sistema de API keys nuevo: la key pública es una **publishable key** (`sb_publishable_...`) en lugar del JWT `anon` de antes (`eyJhbGc...`). El SDK la toma en la misma posición y resuelve al mismo rol de Postgres (`anon`), así que no hay que cambiar nada en el código — la variable sigue llamándose `VITE_SUPABASE_ANON_KEY`.

> La **secret key** (`sb_secret_...`, antes `service_role`) nunca va al frontend ni al repo: bypassea RLS por completo.

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

- [Dashboard](https://supabase.com/dashboard/project/ecmlccnxzgajozsrnbjn)
- [SQL Editor](https://supabase.com/dashboard/project/ecmlccnxzgajozsrnbjn/sql)
- [Table Editor](https://supabase.com/dashboard/project/ecmlccnxzgajozsrnbjn/editor)
- [Auth](https://supabase.com/dashboard/project/ecmlccnxzgajozsrnbjn/auth/users)
- [Edge Functions](https://supabase.com/dashboard/project/ecmlccnxzgajozsrnbjn/functions)
- [Database Webhooks](https://supabase.com/dashboard/project/ecmlccnxzgajozsrnbjn/database/hooks)
- [Spec completa del chatbot Neo](../reference/chatbot-neo-spec.md)
