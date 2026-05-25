import { projects } from "../data/projects";
import type { Messages } from "../i18n/strings";
import type { Lang } from "../i18n/types";
import type { LeadInterest, LeadRegion } from "../lib/supabase";
import type { ProjectCardData } from "../components/chatbot/NeoProjectCards";
import type { QuickReplyOption } from "../components/chatbot/NeoQuickReplies";
import type { SummaryItem } from "../components/chatbot/NeoSummary";
import type { LeadData, StepId } from "./types";

// Mapping de las region keys del state machine a los labels que usa data/projects.ts
// (projects.region es un string crudo, no localized — los nombres son iguales en ES/EN)
const REGION_KEY_TO_PROJECT_LABEL: Record<LeadRegion, string> = {
  "cafayate": "Cafayate",
  "vaca-muerta": "Vaca Muerta",
  "salta-capital": "Salta Capital",
  "otro": "",
};

/**
 * Resuelve el texto del mensaje de Neo para un step + data + idioma actuales.
 * Algunos steps tienen mensajes que dependen del nombre del user o de la región
 * elegida — esta función centraliza la lógica.
 */
export function resolveNeoText(
  stepId: StepId,
  data: LeadData,
  t: Messages,
): string {
  const s = t.neo.steps;
  switch (stepId) {
    case "discover_intent":
      return s.discover_intent.text;
    case "discover_region":
      return s.discover_region.text;
    case "show_projects":
      if (data.region && data.region !== "otro") {
        return s.show_projects.text(t.neo.display.region[data.region]);
      }
      return s.show_projects.textNoRegion;
    case "capture_name":
      return s.capture_name.text;
    case "capture_contact_channel":
      return s.capture_contact_channel.text(data.name ?? "");
    case "capture_contact_value":
      return data.contactChannel === "phone"
        ? s.capture_contact_value.textPhone
        : s.capture_contact_value.textEmail;
    case "confirm":
      return s.confirm.text(data.name ?? "");
    case "post_send":
      return s.post_send.text(data.name ?? "");
    case "closed":
      return s.closed.text;
  }
}

/**
 * Arma las quick replies de los steps que usan ese input type.
 * Los `value` son las keys que se pasan al state machine.
 */
export function buildQuickReplies(
  stepId: StepId,
  t: Messages,
): QuickReplyOption[] {
  const s = t.neo.steps;
  switch (stepId) {
    case "discover_intent":
      return [
        { value: "inversion", label: s.discover_intent.choices.inversion },
        { value: "vivienda", label: s.discover_intent.choices.vivienda },
        { value: "info", label: s.discover_intent.choices.info },
      ];
    case "discover_region":
      return [
        { value: "cafayate", label: s.discover_region.choices["cafayate"] },
        { value: "vaca-muerta", label: s.discover_region.choices["vaca-muerta"] },
        { value: "salta-capital", label: s.discover_region.choices["salta-capital"] },
        { value: "otro", label: s.discover_region.choices["otro"] },
      ];
    case "capture_contact_channel":
      return [
        { value: "email", label: s.capture_contact_channel.choices.email },
        { value: "phone", label: s.capture_contact_channel.choices.phone },
      ];
    default:
      return [];
  }
}

/**
 * Filtra el listado de proyectos por la región elegida y los devuelve
 * en el shape que consume NeoProjectCards (con tagline ya traducido).
 */
export function getProjectsForRegion(
  region: LeadRegion | null | undefined,
  lang: Lang,
): ProjectCardData[] {
  if (!region || region === "otro") return [];
  const regionLabel = REGION_KEY_TO_PROJECT_LABEL[region];
  if (!regionLabel) return [];
  return projects
    .filter((p) => p.region === regionLabel)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline[lang],
      heroImage: p.heroImage,
    }));
}

export function getProjectName(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return projects.find((p) => p.slug === slug)?.name;
}

/**
 * Arma los items del NeoSummary para el step `confirm`.
 * Omite los campos que no se capturaron (ej: region si user eligió "info").
 */
export function buildSummaryItems(
  data: LeadData,
  t: Messages,
  projectName?: string,
): SummaryItem[] {
  const items: SummaryItem[] = [];
  const c = t.neo.steps.confirm;
  if (data.name) items.push({ label: c.labelName, value: data.name });
  if (data.email) items.push({ label: c.labelEmail, value: data.email });
  if (data.phone) items.push({ label: c.labelPhone, value: data.phone });
  if (data.interest) {
    items.push({
      label: c.labelInterest,
      value: t.neo.display.interest[data.interest],
    });
  }
  if (data.region && data.region !== "otro") {
    items.push({
      label: c.labelRegion,
      value: t.neo.display.region[data.region],
    });
  }
  if (projectName) {
    items.push({ label: c.labelProject, value: projectName });
  }
  return items;
}

/**
 * Construye la URL de WhatsApp con el mensaje prellenado en base al lead
 * (nombre + interés + región). Se usa en el step `post_send`.
 */
export function buildWhatsAppUrl(
  phoneE164: string,
  name: string,
  interest: LeadInterest | null | undefined,
  region: LeadRegion | null | undefined,
  t: Messages,
): string {
  const interestLabel = interest ? t.neo.display.interest[interest] : null;
  const regionLabel =
    region && region !== "otro" ? t.neo.display.region[region] : null;
  const message = t.neo.steps.post_send.whatsappPrefill(
    name,
    interestLabel,
    regionLabel,
  );
  const digits = phoneE164.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
