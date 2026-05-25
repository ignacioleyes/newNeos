import type { LeadInterest, LeadRegion } from "../lib/supabase";

export type StepId =
  | "discover_intent"
  | "discover_region"
  | "show_projects"
  | "capture_name"
  | "capture_contact_channel"
  | "capture_contact_value"
  | "confirm"
  | "post_send"
  | "closed";

export type ContactChannel = "email" | "phone";

export interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  contactChannel?: ContactChannel;
  interest?: LeadInterest;
  region?: LeadRegion;
  projectSlug?: string;
  whatsappClicked?: boolean;
}

export type InputType =
  | "quick_replies"
  | "text_input"
  | "project_cards"
  | "summary"
  | "post_send_actions"
  | "none";

export interface StepConfig {
  id: StepId;
  input: InputType;
  choices?: readonly string[];
  textInputKind?: "text" | "email" | "tel";
}

export interface NeoMessage {
  id: string;
  from: "neo";
  stepId: StepId;
  timestamp: string;
}

export interface UserMessage {
  id: string;
  from: "user";
  text: string;
  answerValue: unknown;
  timestamp: string;
}

export type ChatMessage = NeoMessage | UserMessage;

export interface ConversationStepLog {
  step: StepId;
  [key: string]: unknown;
}

export interface ChatbotState {
  currentStep: StepId;
  history: StepId[];
  messages: ChatMessage[];
  data: LeadData;
  isTyping: boolean;
  startedAt: string | null;
}
