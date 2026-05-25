import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Faltan variables de entorno de Supabase. Revisá .env.local — necesitás VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY."
  );
}

export type LeadInterest = "inversion" | "vivienda" | "info";
export type LeadRegion = "cafayate" | "vaca-muerta" | "salta-capital" | "otro";
export type LeadSource = "chatbot" | "contact-form" | "whatsapp";
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export interface ConversationStep {
  step: string;
  [key: string]: unknown;
}

export interface ConversationLog {
  version: number;
  started_at: string;
  ended_at: string;
  lang: "es" | "en";
  steps: ConversationStep[];
}

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  interest: LeadInterest | null;
  region: LeadRegion | null;
  project_slug: string | null;
  source: LeadSource;
  lang: "es" | "en";
  user_agent: string | null;
  referrer: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  notes: string | null;
  conversation: ConversationLog | null;
}

export type LeadInsert = {
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  interest?: LeadInterest | null;
  region?: LeadRegion | null;
  project_slug?: string | null;
  source?: LeadSource;
  lang?: "es" | "en";
  user_agent?: string | null;
  referrer?: string | null;
  conversation?: ConversationLog | null;
};

// Cliente Supabase sin generic `Database` — la v2.106+ del SDK tiene un
// constraint estricto (`GenericSchema`) sobre el shape de Database que no
// satisface bien nuestros tipos. Como la type safety que nos importa está
// en cómo armamos el payload (LeadInsert), dejamos el cliente untyped y
// los tipos quedan para uso en la app.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});
