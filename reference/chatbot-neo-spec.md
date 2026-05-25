# Neo — Chatbot conversacional para NEOS

> Plan de diseño e implementación. Documento vivo: se actualiza a medida que tomamos decisiones.

> **Update 2026-05-25 — Cambio de arquitectura.** Decidimos NO usar Resend ni email externo. Las notificaciones de nuevos leads se hacen vía **Supabase Realtime** dentro de la app de gestión interna (Fase 2). Esto refuerza el pitch del SaaS — sin la app, no hay notificaciones automáticas. Además, el formulario de contacto se conecta a la **misma tabla `leads`** que el chatbot, diferenciado por el campo `source`. Ver § 9.

---

## 1. Visión

Captar leads de visitantes que **no quieren saltar a WhatsApp** de entrada. Neo conversa, recolecta nombre + contacto + interés en forma natural, persiste el lead en Supabase y notifica al equipo comercial por email. WhatsApp pasa a segundo plano — sólo aparece en el sidebar y al lado del formulario de Contacto, y como CTA opcional al final del chat (lead ya caliente).

Además, **siembra la infra del futuro CRM interno** que Grupo SaltaPor podrá comprar como producto separado (ver Fase 2 y 3).

### Pilares de UX

- Conversación corta (5–7 turnos máx hasta capturar contacto)
- Cada paso permite cerrar o saltar
- Quick replies, no campos libres salvo nombre / email / tel
- Tono cercano, no corporativo
- Avatar = iso magenta de NEOS, no genérico

---

## 2. Stack y arquitectura

```
┌──────────────────────────────────────────────────────────┐
│ Frontend (React 19 + TS + Tailwind v4)                   │
│                                                           │
│   Canal 1: Chatbot Neo                                   │
│     ├─ NeoButton (FAB)                                   │
│     ├─ NeoWidget (panel)                                 │
│     └─ useChatbot + state machine                        │
│                                                           │
│   Canal 2: Formulario de contacto                        │
│     └─ Contact.tsx → submitLead()                        │
└─────────────────────────┬────────────────────────────────┘
                          │ INSERT lead (ambos canales)
                          │ source: "chatbot" | "contact-form"
                          ▼
┌──────────────────────────────────────────────────────────┐
│ Supabase                                                  │
│   ├─ Postgres → tabla `leads` (con RLS)                  │
│   ├─ Auth (preparado para Fase 2)                        │
│   └─ Realtime (Fase 2 — notificaciones in-app)           │
└──────────────────────────────────────────────────────────┘
                          │
              (Fase 2: dashboard interno)
                          ▼
┌──────────────────────────────────────────────────────────┐
│ App de gestión NEOS (Fase 2)                             │
│   ├─ Listener Realtime → notificación in-app < 1s        │
│   ├─ Tabla de leads + filtros + mapa de calor            │
│   └─ Vendedor toma lead → responde por WhatsApp/email    │
└──────────────────────────────────────────────────────────┘
```

### Tecnologías

| Componente | Elección | Por qué |
|------------|----------|---------|
| Backend / DB | **Supabase** | Postgres + Auth + Realtime + RLS en un solo lugar. Free tier cubre v1 sobrado. |
| Notificaciones | **Supabase Realtime** (en Fase 2) | Built-in, WebSocket nativo, <1s de latencia. No requiere proveedor de email. Refuerza el pitch del SaaS. |
| Motor del chatbot | **State machine scripted** (no IA) | Predecible, sin costos por token, sin riesgo de alucinar precios o info de propiedades. |
| Cliente Supabase | `@supabase/supabase-js` | Oficial, soporta TS, manejo de sesiones para v2. |

> **¿Y los emails automáticos?** Descartados a propósito — ver § 9 para el razonamiento. Los archivos `supabase/functions/_shared/emailTemplate.ts` y `email-preview.html` quedan en el repo por si en el futuro se quiere reactivar.

---

## 3. FASE 1 — Lead capture (alcance actual)

### 3.1 Schema SQL — tabla `leads`

```sql
create extension if not exists "uuid-ossp";

create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  -- Datos del lead (capturados por Neo)
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

  -- Pipeline (se usa en v2)
  status          text default 'new',      -- 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
  assigned_to     uuid,                    -- FK a auth.users (v2)
  notes           text,

  -- Conversación completa
  conversation    jsonb                    -- log paso a paso para análisis
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx     on public.leads (status);
create index leads_email_idx      on public.leads (email);

alter table public.leads enable row level security;

-- v1: el chatbot público inserta como rol anon
create policy "Anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- v2: empleados autenticados leen y actualizan
create policy "Authenticated can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated can update leads"
  on public.leads for update
  to authenticated
  using (true);
```

### 3.2 Estructura del campo `conversation` (JSONB)

```json
{
  "version": 1,
  "started_at": "2026-05-25T18:32:01Z",
  "ended_at":   "2026-05-25T18:33:47Z",
  "lang": "es",
  "steps": [
    { "step": "greeting",        "user_choice": null },
    { "step": "discover_intent", "user_choice": "inversion" },
    { "step": "discover_region", "user_choice": "cafayate" },
    { "step": "show_projects",   "viewed": ["chaquies"] },
    { "step": "capture_name",    "value": "Juan Pérez" },
    { "step": "capture_contact", "channel": "email", "value": "juan@mail.com" },
    { "step": "confirm",         "confirmed": true },
    { "step": "post_send",       "whatsapp_clicked": true }
  ]
}
```

Sirve después para responder preguntas como: ¿en qué paso se cae más gente? ¿qué región más se elige? ¿cuántos llegan al final y aún así no dejan contacto?

### 3.3 Edge Function — `send-lead-notification` (DEFERIDA)

> **NOTA**: esta sección queda como referencia técnica. El email automático se descartó en favor de Supabase Realtime en Fase 2 (ver § 9). El código del template HTML está escrito en `supabase/functions/_shared/emailTemplate.ts` y se puede reactivar en cualquier momento si la decisión cambia.

---

#### Diseño original (no implementado)

**Ubicación:** `supabase/functions/send-lead-notification/index.ts`

**Trigger:** Database Webhook configurado desde el dashboard de Supabase (`Database → Webhooks → on INSERT en leads`).

```ts
// supabase/functions/send-lead-notification/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const TO_EMAIL       = Deno.env.get("LEAD_NOTIFICATION_EMAIL") ?? "info@neos.ar";
const FROM_EMAIL     = Deno.env.get("FROM_EMAIL") ?? "Neo <neo@neos.ar>";

interface LeadInsertPayload {
  type: "INSERT";
  table: "leads";
  record: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    interest: string | null;
    region: string | null;
    project_slug: string | null;
    lang: string;
    conversation: unknown;
    created_at: string;
  };
}

serve(async (req) => {
  const payload = (await req.json()) as LeadInsertPayload;
  const lead = payload.record;

  const html = renderLeadEmail(lead);
  const subject = `Nuevo lead desde Neo — ${lead.name}${lead.region ? ` · ${lead.region}` : ""}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to:   [TO_EMAIL],
      subject,
      html,
      reply_to: lead.email ?? undefined,
    }),
  });

  if (!res.ok) {
    return new Response(`Resend error: ${await res.text()}`, { status: 500 });
  }
  return new Response("ok");
});

function renderLeadEmail(lead: LeadInsertPayload["record"]): string {
  // ver sección 3.4 del spec
}
```

### 3.4 Template HTML del email

Layout (visual):

```
┌────────────────────────────────────────────────┐
│  ▲ NEOS   (header magenta #E91E8C)             │
│           Nuevo lead desde Neo                  │
├────────────────────────────────────────────────┤
│                                                 │
│  Hola equipo,                                   │
│                                                 │
│  Neo capturó un nuevo lead:                     │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ Nombre     · Juan Pérez                 │  │
│  │ Email      · juan@mail.com              │  │
│  │ Teléfono   · +54 9 387 ...              │  │
│  │ Interés    · Inversión                  │  │
│  │ Zona       · Cafayate                   │  │
│  │ Proyecto   · Chaquíes                   │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  Resumen de la conversación:                    │
│   • Intención: invertir                         │
│   • Zona elegida: Cafayate                      │
│   • Vio: Chaquíes                               │
│   • Hizo click en WhatsApp al final: sí         │
│                                                 │
│  [ Responder por WhatsApp ]  (botón magenta)    │
│                                                 │
├────────────────────────────────────────────────┤
│  Lead #abc123 · 25/05/2026 18:33 · Origen: web │
└────────────────────────────────────────────────┘
```

El botón "Responder por WhatsApp" lleva a `https://wa.me/5493872233240?text=<mensaje prellenado con nombre + interés>`.

Diseño: usar tabla HTML inline (compatible con todos los clientes de mail), tipografía sans-serif system, header con color de marca, paleta consistente con la landing.

### 3.5 Flujo conversacional de Neo (state machine)

```
   ┌──────────┐
   │  IDLE    │  (FAB visible, badge "1" tras 20s o 50% scroll)
   └────┬─────┘
        │ user click
        ▼
   ┌──────────┐
   │ GREETING │  "Hola, soy Neo 👋 — te ayudo a explorar los proyectos de NEOS"
   └────┬─────┘
        │ "¿Qué te interesa?" [Invertir] [Vivienda] [Solo info]
        ▼
   ┌────────────────┐
   │ DISCOVER_INTENT│
   └────┬───────────┘
        │
        ▼
   ┌────────────────┐
   │ DISCOVER_REGION│  "¿Tenés alguna zona en mente?"
   │                │   [Cafayate] [Vaca Muerta] [Salta Capital] [Aún no sé]
   └────┬───────────┘
        │
        ▼
   ┌────────────────┐
   │ SHOW_PROJECTS  │  Muestra 1-3 cards de proyectos filtrados por zona+intención
   │                │  con [Ver proyecto →] (abre /proyectos/:slug en nueva pestaña)
   └────┬───────────┘
        │ "¿Querés que un asesor te mande más info?"  [Sí, dale] [Después]
        ▼
   ┌────────────────┐
   │ CAPTURE_NAME   │  "¿Cómo te llamás?"  → input text
   └────┬───────────┘
        │
        ▼
   ┌──────────────────┐
   │ CAPTURE_CONTACT  │  "¿Mail o teléfono?"  [Mail] [Teléfono]
   │                  │  → input según elección, con validación
   └────┬─────────────┘
        │
        ▼
   ┌─────────┐
   │ CONFIRM │  Muestra resumen + [Confirmar] [Editar]
   └────┬────┘
        │ confirm → INSERT en Supabase
        ▼
   ┌──────────┐
   │POST_SEND │  "¡Listo, Juan! Te vamos a escribir en breve."
   │          │  "¿Querés también escribirnos por WhatsApp ahora?"
   │          │  [Abrir WhatsApp] [No, gracias]
   └──────────┘
```

**Variantes:**
- Si elige "Solo info" en intent → flujo más corto: skip región, va directo a CAPTURE_NAME pero opcional ("dejá tu mail si querés recibir nuestro brochure").
- Si elige "Aún no sé" en región → skip SHOW_PROJECTS, va directo a captura.
- En cualquier paso: botón [Cerrar] (no manda nada) y [Atrás] (vuelve un step).

### 3.6 Componentes UI a crear

```
src/
├── components/
│   └── chatbot/
│       ├── NeoButton.tsx        # FAB flotante con badge
│       ├── NeoWidget.tsx        # Panel del chat (overlay mobile, side-panel desktop)
│       ├── NeoHeader.tsx        # Header con avatar + nombre + close
│       ├── NeoMessage.tsx       # Burbuja de mensaje (variant: 'neo' | 'user')
│       ├── NeoQuickReplies.tsx  # Botones de respuesta rápida
│       ├── NeoTyping.tsx        # Indicador "..." animado
│       ├── NeoTextInput.tsx     # Input cuando hay que tipear (nombre/email/tel)
│       └── NeoSummary.tsx       # Card de resumen en CONFIRM
├── chatbot/
│   ├── steps.ts                 # Definición declarativa del state machine
│   ├── useChatbot.ts            # Hook: state, history, send, goBack, reset
│   ├── persistence.ts           # Save/load progreso en localStorage
│   └── leadService.ts           # INSERT a Supabase + dedup por email
└── lib/
    └── supabase.ts              # Client singleton
```

**Estilo visual:**
- FAB: 56×56 px, magenta primary, iso NEOS centrado en blanco, sombra suave, esquina inferior derecha 24 px margen.
- Badge "1" sobre el FAB con animación pulse cuando aparece proactivo.
- Widget desktop: 380×600 px, anclado bottom-right, border-radius 16 px.
- Widget mobile: full screen overlay desde abajo (slide-up).
- Burbujas Neo: fondo `base-200`, esquina top-left chica.
- Burbujas user: fondo `primary`, texto blanco, alineadas derecha.
- Quick replies: chips con borde, hover magenta.

### 3.7 Trigger de aparición

```ts
// Lógica en NeoButton.tsx
const [proactiveOpen, setProactiveOpen] = useState(false);

useEffect(() => {
  // No mostrar si ya se abrió en esta sesión
  if (sessionStorage.getItem("neo.shown")) return;

  const timer  = setTimeout(() => triggerProactive("time"), 20_000);
  const onScroll = () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (pct > 0.5) triggerProactive("scroll");
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
}, []);

function triggerProactive(reason: "time" | "scroll") {
  sessionStorage.setItem("neo.shown", reason);
  setProactiveOpen(true);  // muestra badge + tooltip "Hola, soy Neo"
}
```

### 3.8 Variables de entorno

**Frontend** (`.env.local`):
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Supabase Edge Function secrets** (configurados desde el dashboard):
```
RESEND_API_KEY=re_xxx
LEAD_NOTIFICATION_EMAIL=info@neos.ar
FROM_EMAIL=Neo <neo@neos.ar>
```

### 3.9 Cambios en componentes existentes

| Componente | Cambio |
|-----------|--------|
| `Hero.tsx` | Quitar (o atenuar) CTA WhatsApp del bloque principal. Neo lo reemplaza. |
| `Sidebar.tsx` | **Mantener** WhatsApp visible (queda como canal secundario). |
| `Contact.tsx` | **Mantener** WhatsApp al lado del formulario. |
| `App.tsx` (o nuevo `Layout.tsx`) | Montar `<NeoButton />` global, fuera del scroll. |
| `src/i18n/strings.ts` | Agregar bloque `neo: { ... }` bilingüe (saludos, quick replies, validaciones). |

### 3.10 Internacionalización

Todo el copy de Neo en `src/i18n/strings.ts`:

```ts
neo: {
  greeting:        { es: "Hola, soy Neo. Te ayudo a explorar los proyectos de NEOS.", en: "Hi, I'm Neo. I'll help you explore NEOS' projects." },
  intentQuestion:  { es: "¿Qué te interesa?", en: "What are you looking for?" },
  intentInvest:    { es: "Invertir", en: "Invest" },
  intentLive:      { es: "Buscar vivienda", en: "Find a home" },
  intentInfo:      { es: "Solo info", en: "Just browsing" },
  // ... etc
}
```

### 3.11 Validaciones y anti-spam

- Email: regex estándar + dominio con TLD válido
- Teléfono: regex argentina `^(\+?54)?\s?9?\s?\d{2,4}\s?\d{6,8}$`
- Honeypot: campo oculto `<input name="website" />` — si viene lleno, descartar silenciosamente
- Rate limit cliente: max 1 envío por minuto desde la misma sesión
- (Opcional v2) Cloudflare Turnstile en el último step si detectamos spam

### 3.12 Plan de implementación — orden de ejecución

1. **Supabase setup**
   - Crear proyecto, correr el SQL del schema (3.1)
   - Crear cuenta Resend, verificar dominio `neos.ar` (DNS) — fallback: usar `onboarding@resend.dev` mientras se verifica
   - Cargar secrets en Supabase
2. **Frontend infra**
   - Instalar `@supabase/supabase-js`
   - `src/lib/supabase.ts` con client
   - Agregar env vars al `.env.local` y `.env.example`
3. **State machine** (sin UI todavía)
   - `src/chatbot/steps.ts` con definición declarativa
   - `src/chatbot/useChatbot.ts` con tests unitarios
4. **UI components**
   - `NeoButton` + `NeoWidget` shells con animaciones
   - `NeoMessage`, `NeoQuickReplies`, `NeoTextInput`, `NeoTyping`
5. **Integración hook ↔ UI**
6. **Persistencia**
   - `leadService.ts` con INSERT + dedup por email (update si existe en últimos 7 días)
   - localStorage para retomar conversación interrumpida
7. **Edge Function** `send-lead-notification`
   - Deploy con `supabase functions deploy`
   - Crear DB Webhook on INSERT desde dashboard
   - Test con un INSERT manual
8. **Email template** (HTML inline)
9. **i18n** — copy ES/EN en strings.ts
10. **Cambios en Hero / Contact / Sidebar** según 3.9
11. **QA end-to-end** — flujo completo en mobile y desktop, ambos idiomas
12. **Ajuste de copy con vos** (sesión rápida revisando texto de Neo)

### 3.13 Costos esperados v1

| Servicio | Free tier | Estimado v1 | Costo |
|----------|-----------|-------------|-------|
| Supabase | 500 MB DB · 50K MAU · 2M function invocations | < 1K leads/mes | **$0** |
| Resend | 3K mails/mes · 1 dominio | < 1K mails/mes | **$0** |
| **Total v1** | | | **$0/mes** |

Si crece a > 3K leads/mes: Resend pasa a $20/mes (50K mails). Supabase free tier alcanza hasta varios miles más de leads.

### 3.14 Métricas a trackear (loguear en `conversation` o tabla separada)

- `chatbot_opened` (manual vs proactivo)
- `conversation_started` (primer click de respuesta)
- `step_completed` por step
- `step_abandoned` por step (cierre antes de avanzar)
- `lead_captured`
- `whatsapp_clicked_post_send`
- `time_to_first_response` (vendedor responde → se mide en v2 cuando exista status `contacted`)

---

## 4. FASE 2 — Roadmap "Sistema de gestión para NEOS" (pitch, NO se implementa ahora)

**Objetivo:** Convertir el lead capture en un mini-CRM accesible para empleados de NEOS, todo en la misma landing. Argumento de venta: "el sistema ya recibe tus leads, ahora lo gestionás vos. Y te avisa al instante."

### Features

- **Login** (Supabase Auth, email + password o Google)
- **Rutas protegidas** `<ProtectedRoute>` que valida session
- **`/admin/leads`** — tabla con filtros (estado, zona, fecha, asignado a, **source: chatbot vs form**)
- **Notificaciones in-app en tiempo real** vía **Supabase Realtime**:
  - Suscripción a `INSERT` sobre `public.leads`
  - Notificación toast + sonido opcional en TODAS las pantallas conectadas, **< 1 segundo** después del lead
  - Badge contador en el sidebar con leads sin asignar
  - El primer vendedor que la tome se la asigna (race condition manejada por UPDATE atómico con `assigned_to IS NULL`)
- **Mapa de calor / priorización** — leads más calientes destacados (alto presupuesto, zona premium, datos completos)
- **Detalle del lead** `/admin/leads/:id` — datos + timeline de la conversación + mensaje libre + notas internas + botón "Responder por WhatsApp/email"
- **Cambio de estado** — new → contacted → qualified → won / lost
- **Asignación** de leads a vendedores (campo `assigned_to`)
- **Roles** — `admin` (todo) / `vendedor` (sólo sus leads asignados) — vía RLS
- **Búsqueda** por nombre / email / teléfono / mensaje libre
- **Analytics de conversión por canal** — chatbot vs form, tasa de respuesta, tiempo promedio

### Pitch line para NEOS

> *"Cuando un cliente potencial completa el chat o el formulario, en menos de 1 segundo aparece una notificación en TODAS las pantallas del equipo NEOS. El primero que la tome, se la asigna."*

### Estimado: 2–3 semanas

### Stack adicional

- React Router (ya existe) — agregar `/login`, `/admin/*`
- shadcn/ui Table o TanStack Table para el listado
- Date-fns para formatos de fecha
- `supabase.channel('leads-changes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, cb).subscribe()` para el Realtime

---

## 5. FASE 3 — SaaS completo (visión, para el pitch comercial)

**Objetivo:** Producto vendible no sólo a NEOS sino a otras inmobiliarias (multi-tenant).

### Features

- **Pipeline kanban** drag & drop por estado
- **Asignación automática** round-robin a vendedores
- **Integración WhatsApp Business API** — vendedor responde desde el dashboard, conversación queda asociada al lead
- **Email marketing** a leads viejos (sequences automáticas, "te interesó Cafayate hace 3 meses, mirá esta nueva unidad")
- **Reportes** — leads/mes, conversión por zona, tiempo de respuesta promedio, ranking de vendedores
- **PWA mobile** interna para vendedores en la calle
- **Multi-tenant** — cada inmobiliaria con su workspace
- **Webhooks** a Zapier / Make para integrar con sistemas legacy del cliente
- **Reglas de scoring** — leads se priorizan automáticamente (zona premium + presupuesto alto = score alto)

### Estimado: 2–3 meses

---

## 6. Decisiones tomadas

| Decisión | Elección | Fecha |
|----------|----------|-------|
| Motor del bot | Scripted state machine (sin IA en v1) | 2026-05-25 |
| Persistencia | Lead completo + log de conversación en JSONB | 2026-05-25 |
| Nombre del bot | Neo | 2026-05-25 |
| Avatar | Iso magenta de NEOS | 2026-05-25 |
| Trigger | FAB siempre visible + apertura proactiva (20 s o 50 % scroll, 1 vez por sesión) | 2026-05-25 |
| Rol de WhatsApp | Secundario — sidebar, contact form, CTA post-chat | 2026-05-25 |
| Stack backend | Supabase (DB + Auth + Realtime) | 2026-05-25 |
| **Notificaciones** | **Supabase Realtime en Fase 2 — NO email externo** (§ 9) | 2026-05-25 |
| **Form de contacto** | **Unificado con chatbot — misma tabla `leads`, diferenciado por `source`** | 2026-05-25 |
| **Columna `message`** | Agregada para mensajes libres del form (chatbot no usa) | 2026-05-25 |

---

## 7. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| Lead con datos falsos / bots | Validación formato + honeypot + rate limit cliente |
| Spam masivo automatizado | Cloudflare Turnstile en último step si pasa cierto umbral |
| Dominio `neos.ar` no se puede verificar en Resend | Empezar con `onboarding@resend.dev`, migrar cuando esté listo |
| Conversación interrumpida (usuario refresca / cierra) | Guardar parcial en `localStorage` cada step, ofrecer retomar al volver |
| Email a `info@neos.ar` rebota o cae en spam | Configurar SPF + DKIM + DMARC en DNS de neos.ar (parte del verify de Resend) |
| Edge Function falla y se pierde el aviso | Lead queda persistido igual en la tabla — agregar reintento con `pg_cron` en v2 |
| Demasiados leads colapsan free tier | Métricas mensuales + alerta en dashboard Supabase a 80 % de uso |

---

## 8. Open questions

- ¿Validamos número argentino sólo o también internacional? (lead extranjero existente)
- ¿Queremos un sonido sutil cuando Neo aparece proactivo, o sólo animación visual?
- ¿La aparición proactiva se respeta también en mobile (puede ser intrusivo) o sólo desktop?
- En v2, ¿el login es sólo email/password o también Google SSO con dominio `@neos.ar` restringido?
- En v2, ¿el toast de notificación de lead nuevo va con sonido + browser notification API (push), o sólo visual?

---

## 9. Cambio de arquitectura — Sin email externo, Realtime para notificaciones

**Decisión tomada el 2026-05-25** durante la implementación. Reemplaza la sección original que dependía de Resend.

### Contexto

El plan original incluía una Edge Function que mandaba un email a `info@neos.ar` por cada lead nuevo, usando Resend como proveedor de email. Esto resolvía el problema del "lead frío" — el comercial recibe el aviso al instante.

### El problema con ese approach

1. **Dependencia externa** que requiere setup (cuenta Resend, verificación DNS de neos.ar, configuración de SPF/DKIM/DMARC).
2. **Free tier limitado** (3000 mails/mes — alcanza, pero hay un techo).
3. **Email es "fuera del sistema"** — el comercial responde desde su cliente de email, el dato no vuelve a la app.
4. **No suma valor al pitch del SaaS** que querés venderle a NEOS — el email automático "ya estaría resuelto" y NEOS no necesitaría tu app para enterarse de los leads.

### La alternativa elegida

**Notificaciones in-app vía Supabase Realtime, dentro de la app de gestión (Fase 2).**

- **Sin Resend ni email externo**.
- El formulario de contacto y el chatbot escriben ambos a la misma tabla `leads` (diferenciados por `source`).
- En Fase 2, la app interna se suscribe a `INSERT` sobre `leads` y dispara una notificación toast en todas las pantallas conectadas en < 1 segundo.
- El comercial toma el lead desde la app, responde por WhatsApp o email manualmente (mensaje personalizado > template automático).

### Por qué esto refuerza el pitch

- **El problema vive dentro del sistema que se vende.** Sin la app, no hay notificación.
- **Pitch line concreta**: *"Cuando un cliente potencial completa el chat o el formulario, en menos de 1 segundo aparece una notificación en TODAS las pantallas del equipo NEOS. El primero que la tome, se la asigna."*
- **Unifica intake con gestión.** Todos los leads (chatbot + form + WhatsApp manual) en un solo dashboard.
- **Sin costos ocultos** — Realtime viene en el free tier de Supabase (200 conexiones concurrentes, más que suficiente).

### Consecuencias técnicas

- **Tareas canceladas**: #34 (Resend API key), #42 (deploy Edge Function).
- **Tarea conservada como referencia**: #43 (template HTML del email) — el código queda en `supabase/functions/_shared/emailTemplate.ts` por si en el futuro se quiere reactivar.
- **Nueva tarea**: wire del formulario de contacto a `submitLead()` (HECHO).
- **Nueva migration**: `add_message_to_leads.sql` — columna `message` para el mensaje libre del form.
- **Fase 2 ampliada**: agregamos la suscripción Realtime + sistema de notificaciones in-app a las features prioritarias.

### Trade-off aceptado

Hasta que la app de Fase 2 esté lista, los leads quedan en la tabla sin que nadie los vea automáticamente. **Mientras tanto, el comercial revisa el [Table Editor de Supabase](https://supabase.com/dashboard/project/slgrwwgmfrrqaludqbhy/editor) manualmente.** Es un período de transición chico (semanas, no meses) y el costo es bajo vs. lo que se gana en el pitch.
