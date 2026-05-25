import type { LeadInterest, LeadRegion } from "../lib/supabase";
import type {
  ConversationStepLog,
  ContactChannel,
  LeadData,
  StepConfig,
  StepId,
} from "./types";

// =============================================================================
// Step configs
// =============================================================================

export const STEP_CONFIGS: Record<StepId, StepConfig> = {
  discover_intent: {
    id: "discover_intent",
    input: "quick_replies",
    choices: ["inversion", "vivienda", "info"],
  },
  discover_region: {
    id: "discover_region",
    input: "quick_replies",
    choices: ["cafayate", "vaca-muerta", "salta-capital", "otro"],
  },
  show_projects: {
    id: "show_projects",
    input: "project_cards",
  },
  capture_name: {
    id: "capture_name",
    input: "text_input",
    textInputKind: "text",
  },
  capture_contact_channel: {
    id: "capture_contact_channel",
    input: "quick_replies",
    choices: ["email", "phone"],
  },
  capture_contact_value: {
    id: "capture_contact_value",
    input: "text_input",
  },
  confirm: {
    id: "confirm",
    input: "summary",
  },
  post_send: {
    id: "post_send",
    input: "post_send_actions",
  },
  closed: {
    id: "closed",
    input: "none",
  },
};

export const INITIAL_STEP: StepId = "discover_intent";

// =============================================================================
// Validators
// =============================================================================

export type ValidationError = "min" | "format";
export type ValidationResult =
  | { valid: true }
  | { valid: false; error: ValidationError };

export function validateName(value: string): ValidationResult {
  if (value.trim().length < 2) return { valid: false, error: "min" };
  return { valid: true };
}

export function validateEmail(value: string): ValidationResult {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(value.trim())) return { valid: false, error: "format" };
  return { valid: true };
}

export function validatePhone(value: string): ValidationResult {
  const cleaned = value.replace(/[\s\-().]/g, "");
  // Acepta argentina y formatos internacionales básicos. Mínimo 8 dígitos.
  const re = /^(\+?\d{1,3})?9?\d{8,12}$/;
  if (!re.test(cleaned)) return { valid: false, error: "format" };
  return { valid: true };
}

export function validateContactValue(
  value: string,
  channel: ContactChannel,
): ValidationResult {
  return channel === "email" ? validateEmail(value) : validatePhone(value);
}

// =============================================================================
// Transition function — pure, side-effect-free
// =============================================================================

export interface TransitionInput {
  currentStep: StepId;
  data: LeadData;
  answer: unknown;
}

export interface TransitionResult {
  nextStep: StepId;
  data: LeadData;
  logEntry: ConversationStepLog;
}

export function transition(input: TransitionInput): TransitionResult {
  const { currentStep, data, answer } = input;

  switch (currentStep) {
    case "discover_intent": {
      const interest = answer as LeadInterest;
      // "info" salta región y proyectos — va directo a captura
      const nextStep: StepId =
        interest === "info" ? "capture_name" : "discover_region";
      return {
        nextStep,
        data: { ...data, interest },
        logEntry: { step: "discover_intent", user_choice: interest },
      };
    }

    case "discover_region": {
      const region = answer as LeadRegion;
      // "otro" (no sé aún) salta el showcase de proyectos
      const nextStep: StepId =
        region === "otro" ? "capture_name" : "show_projects";
      return {
        nextStep,
        data: { ...data, region },
        logEntry: { step: "discover_region", user_choice: region },
      };
    }

    case "show_projects": {
      const slug = (answer as { slug?: string } | undefined)?.slug;
      return {
        nextStep: "capture_name",
        data: slug ? { ...data, projectSlug: slug } : data,
        logEntry: { step: "show_projects", viewed: slug ? [slug] : [] },
      };
    }

    case "capture_name": {
      const name = String(answer).trim();
      return {
        nextStep: "capture_contact_channel",
        data: { ...data, name },
        logEntry: { step: "capture_name", value: name },
      };
    }

    case "capture_contact_channel": {
      const channel = answer as ContactChannel;
      return {
        nextStep: "capture_contact_value",
        data: { ...data, contactChannel: channel },
        logEntry: { step: "capture_contact_channel", channel },
      };
    }

    case "capture_contact_value": {
      const value = String(answer).trim();
      const channel = data.contactChannel ?? "email";
      const patch =
        channel === "email" ? { email: value } : { phone: value };
      return {
        nextStep: "confirm",
        data: { ...data, ...patch },
        logEntry: { step: "capture_contact_value", channel, value },
      };
    }

    case "confirm": {
      const confirmed = answer === true;
      return {
        // Editar vuelve a capture_name; confirmar avanza a post_send
        nextStep: confirmed ? "post_send" : "capture_name",
        data,
        logEntry: { step: "confirm", confirmed },
      };
    }

    case "post_send": {
      const whatsappClicked = answer === "whatsapp";
      return {
        nextStep: "closed",
        data: { ...data, whatsappClicked },
        logEntry: { step: "post_send", whatsapp_clicked: whatsappClicked },
      };
    }

    case "closed":
      return {
        nextStep: "closed",
        data,
        logEntry: { step: "closed" },
      };

    default: {
      const _exhaustive: never = currentStep;
      return _exhaustive;
    }
  }
}
