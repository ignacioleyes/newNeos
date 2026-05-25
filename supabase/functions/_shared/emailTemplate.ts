// =============================================================================
// Email template — Notificación de nuevo lead desde Neo
// =============================================================================
// Genera el HTML + plain text + subject del email que se manda al equipo
// comercial cuando llega un lead nuevo. Diseñado para máxima compatibilidad
// con clientes de email (Gmail, Outlook, Apple Mail):
//   - HTML basado en <table> (Outlook no soporta flexbox/grid)
//   - Estilos inline (algunos clientes strippean <style>)
//   - Fonts del sistema (no @import)
//   - Ancho máx 600px
//   - Plain-text fallback para deliverability
// =============================================================================

// --- Paleta de marca ---------------------------------------------------------

const NEOS_MAGENTA = "#e91e8c";
const WHATSAPP_GREEN = "#25d366";
const TEXT_PRIMARY = "#111111";
const TEXT_SECONDARY = "#555555";
const TEXT_MUTED = "#888888";
const BG_PAGE = "#f5f5f5";
const BG_CARD = "#ffffff";
const BG_CARD_INNER = "#fafafa";
const BORDER = "#ececec";

// --- Diccionarios (siempre en ES — el email es interno al equipo NEOS) ------

const PROJECT_NAMES: Record<string, string> = {
  "chaquies": "Chaquíes",
  "neweken": "Neweken",
  "mercatus": "Mercatus",
  "greet-balcarce": "Greet Balcarce",
  "el-cauce-castellanos": "El Cauce Castellanos",
};

const INTEREST_LABELS: Record<string, string> = {
  inversion: "Inversión",
  vivienda: "Vivienda",
  info: "Consulta general",
};

const REGION_LABELS: Record<string, string> = {
  "cafayate": "Cafayate",
  "vaca-muerta": "Vaca Muerta",
  "salta-capital": "Salta Capital",
};

// --- Tipos -------------------------------------------------------------------

export interface LeadEmailInput {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  interest: string | null;
  region: string | null;
  project_slug: string | null;
  source: string;
  lang: string;
  created_at: string;
}

export interface LeadEmailOutput {
  subject: string;
  html: string;
  text: string;
}

// --- Helpers -----------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(d);
  } catch {
    return iso;
  }
}

function getInterestLabel(key: string | null): string | null {
  if (!key) return null;
  return INTEREST_LABELS[key] ?? key;
}

function getRegionLabel(key: string | null): string | null {
  if (!key) return null;
  return REGION_LABELS[key] ?? key;
}

function getProjectName(slug: string | null): string | null {
  if (!slug) return null;
  return PROJECT_NAMES[slug] ?? slug;
}

function buildWhatsAppReplyUrl(
  name: string,
  phone: string,
  interest: string | null,
  region: string | null,
): string {
  const digits = phone.replace(/[^0-9]/g, "");
  const intro = `Hola ${name}, soy del equipo de NEOS.`;
  let context = "";
  if (interest && region) {
    context = ` Vi tu interés en ${interest.toLowerCase()} en ${region}.`;
  } else if (interest) {
    context = ` Vi tu interés en ${interest.toLowerCase()}.`;
  } else if (region) {
    context = ` Vi tu consulta sobre ${region}.`;
  }
  const message = `${intro}${context} ¿Cuándo podemos charlar?`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function buildEmailReplyUrl(
  email: string,
  name: string,
  interest: string | null,
  region: string | null,
): string {
  const subject = `Re: tu consulta en NEOS${region ? ` — ${region}` : ""}`;
  const bodyLines: string[] = [
    `Hola ${name},`,
    "",
    "Soy del equipo de NEOS. Vi tu consulta" +
      (interest && region
        ? ` sobre ${interest.toLowerCase()} en ${region}.`
        : interest
        ? ` sobre ${interest.toLowerCase()}.`
        : "."),
    "",
    "¿Cuándo podemos charlar?",
    "",
    "Saludos,",
    "Equipo NEOS",
  ];
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
}

function renderInfoRow(label: string, value: string, isLast: boolean): string {
  const border = isLast ? "" : `border-bottom: 1px solid ${BORDER};`;
  return `
    <tr>
      <td style="padding: 14px 20px; ${border}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:${TEXT_MUTED}; width: 100px; vertical-align: top; padding-right: 12px;">${escapeHtml(label)}</td>
            <td style="font-size:15px; color:${TEXT_PRIMARY}; font-weight:500; word-break: break-word;">${escapeHtml(value)}</td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// --- Función principal -------------------------------------------------------

/**
 * Renderiza el email de notificación con HTML, plain text y subject.
 *
 * @example
 * const { subject, html, text } = renderLeadEmail({
 *   id: "abc123...",
 *   name: "Juan Pérez",
 *   email: "juan@mail.com",
 *   phone: null,
 *   interest: "inversion",
 *   region: "cafayate",
 *   project_slug: "chaquies",
 *   source: "chatbot",
 *   lang: "es",
 *   created_at: "2026-05-25T18:33:00Z",
 * });
 *
 * await resend.emails.send({ from, to, subject, html, text });
 */
export function renderLeadEmail(input: LeadEmailInput): LeadEmailOutput {
  const interestLabel = getInterestLabel(input.interest);
  const regionLabel = getRegionLabel(input.region);
  const projectName = getProjectName(input.project_slug);
  const formattedDate = formatDate(input.created_at);
  const shortId = input.id.slice(0, 8);

  const subject = `Nuevo lead desde Neo — ${input.name}${regionLabel ? ` · ${regionLabel}` : ""}`;

  // --- Acción principal: responder por WhatsApp o por email ------------------

  let replyButton = "";
  if (input.phone) {
    const url = buildWhatsAppReplyUrl(
      input.name,
      input.phone,
      interestLabel,
      regionLabel,
    );
    replyButton = `
      <a href="${url}" style="display: inline-block; background: ${WHATSAPP_GREEN}; color: #ffffff; padding: 14px 32px; border-radius: 28px; text-decoration: none; font-weight: 600; font-size: 15px; line-height: 1;">
        Responder por WhatsApp
      </a>
    `;
  } else if (input.email) {
    const url = buildEmailReplyUrl(
      input.email,
      input.name,
      interestLabel,
      regionLabel,
    );
    replyButton = `
      <a href="${url}" style="display: inline-block; background: ${NEOS_MAGENTA}; color: #ffffff; padding: 14px 32px; border-radius: 28px; text-decoration: none; font-weight: 600; font-size: 15px; line-height: 1;">
        Responder por email
      </a>
    `;
  }

  // --- Filas de la card del lead --------------------------------------------

  type Row = { label: string; value: string };
  const rowsData: Row[] = [{ label: "Nombre", value: input.name }];
  if (input.email) rowsData.push({ label: "Email", value: input.email });
  if (input.phone) rowsData.push({ label: "WhatsApp", value: input.phone });
  if (interestLabel) rowsData.push({ label: "Interés", value: interestLabel });
  if (regionLabel) rowsData.push({ label: "Zona", value: regionLabel });
  if (projectName) rowsData.push({ label: "Proyecto", value: projectName });

  const rowsHtml = rowsData
    .map((r, i) => renderInfoRow(r.label, r.value, i === rowsData.length - 1))
    .join("");

  // --- HTML ------------------------------------------------------------------

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0; padding:0; background-color:${BG_PAGE}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: ${TEXT_PRIMARY}; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG_PAGE};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:${BG_CARD}; max-width:600px; border-radius:12px; overflow:hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">

          <!-- Header magenta -->
          <tr>
            <td style="background:${NEOS_MAGENTA}; padding: 28px 32px; color:#ffffff;">
              <p style="margin:0; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; opacity:0.85; font-weight:500;">NEOS · Grupo SaltaPor</p>
              <h1 style="margin:8px 0 0 0; font-size:24px; font-weight:600; letter-spacing:-0.01em;">Nuevo lead desde Neo</h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 32px 12px 32px;">
              <p style="margin:0 0 12px 0; font-size:16px; line-height:1.5;">Hola equipo,</p>
              <p style="margin:0; font-size:15px; line-height:1.6; color:${TEXT_SECONDARY};">Neo capturó un nuevo lead. Estos son los datos:</p>
            </td>
          </tr>

          <!-- Card con datos del lead -->
          <tr>
            <td style="padding: 16px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BORDER}; border-radius:8px;">
                ${rowsHtml}
              </table>
            </td>
          </tr>

          ${
            replyButton
              ? `
          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 8px 32px 32px 32px;">
              ${replyButton}
            </td>
          </tr>
          `
              : ""
          }

          <!-- Footer con metadata -->
          <tr>
            <td style="background:${BG_CARD_INNER}; padding: 16px 32px; font-size:11px; color:${TEXT_MUTED}; border-top:1px solid ${BORDER};">
              Lead #${escapeHtml(shortId)} · ${escapeHtml(formattedDate)} · Origen: ${escapeHtml(input.source)}${input.lang === "en" ? " · Conversación en inglés" : ""}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // --- Plain text fallback (mejora deliverability) ---------------------------

  const textLines: string[] = [
    "NEOS · Grupo SaltaPor",
    "Nuevo lead desde Neo",
    "",
    "Hola equipo,",
    "",
    "Neo capturó un nuevo lead:",
    "",
    `  Nombre: ${input.name}`,
  ];
  if (input.email) textLines.push(`  Email: ${input.email}`);
  if (input.phone) textLines.push(`  WhatsApp: ${input.phone}`);
  if (interestLabel) textLines.push(`  Interés: ${interestLabel}`);
  if (regionLabel) textLines.push(`  Zona: ${regionLabel}`);
  if (projectName) textLines.push(`  Proyecto: ${projectName}`);
  textLines.push("");
  if (input.phone) {
    textLines.push(
      `Responder por WhatsApp: ${buildWhatsAppReplyUrl(input.name, input.phone, interestLabel, regionLabel)}`,
    );
  } else if (input.email) {
    textLines.push(`Responder por email: mailto:${input.email}`);
  }
  textLines.push("");
  textLines.push(
    `--\nLead #${shortId} · ${formattedDate} · Origen: ${input.source}${input.lang === "en" ? " · Conversación en inglés" : ""}`,
  );

  return {
    subject,
    html,
    text: textLines.join("\n"),
  };
}
