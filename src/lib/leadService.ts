import type { Lang } from "../i18n/types";
import {
  supabase,
  type ConversationLog,
  type LeadInsert,
  type LeadInterest,
  type LeadRegion,
  type LeadSource,
} from "./supabase";

export interface SubmitLeadPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  /** Mensaje libre del lead (form de contacto). Chatbot lo deja en null. */
  message?: string | null;
  interest?: LeadInterest | null;
  region?: LeadRegion | null;
  project_slug?: string | null;
  /** De dónde viene el lead. Decide cómo el dashboard lo categoriza. */
  source: LeadSource;
  lang: Lang;
  /** Log estructurado para chatbot. Form lo deja en null. */
  conversation?: ConversationLog | null;
}

/**
 * Inserta un lead en la tabla `leads` de Supabase. Lo usan ambos canales:
 *   - El chatbot Neo (source: "chatbot", incluye conversation)
 *   - El formulario de contacto (source: "contact-form", incluye message)
 *
 * - Normaliza `region: "otro"` a `null` (no se persiste como valor).
 * - Agrega `user_agent` y `referrer` para trazabilidad.
 * - Corre con la `anon` key — la RLS policy "Anon can insert leads" lo permite.
 *
 * Lanza el error de Supabase si falla — el caller decide cómo presentarlo.
 */
export async function submitLead(payload: SubmitLeadPayload): Promise<void> {
  if (!payload.name) {
    throw new Error("Lead name is required");
  }

  const insertPayload: LeadInsert = {
    name: payload.name,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    interest: payload.interest ?? null,
    region:
      payload.region && payload.region !== "otro" ? payload.region : null,
    project_slug: payload.project_slug ?? null,
    source: payload.source,
    lang: payload.lang,
    user_agent:
      typeof navigator !== "undefined" ? navigator.userAgent : null,
    referrer:
      typeof document !== "undefined" ? document.referrer || null : null,
    conversation: payload.conversation ?? null,
  };

  const { error } = await supabase.from("leads").insert(insertPayload);

  if (error) {
    console.error("[NEOS] Error inserting lead:", error);
    throw error;
  }
}
