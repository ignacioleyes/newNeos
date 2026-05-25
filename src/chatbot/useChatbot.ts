import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import type { ConversationLog } from "../lib/supabase";
import { INITIAL_STEP, transition } from "./steps";
import type {
  ChatMessage,
  ChatbotState,
  ConversationStepLog,
  NeoMessage,
  StepId,
  UserMessage,
} from "./types";

const NEO_TYPING_MS = 700;
const NEO_GREETING_DELAY_MS = 400;

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeNeoMessage(stepId: StepId): NeoMessage {
  return { id: makeId(), from: "neo", stepId, timestamp: nowIso() };
}

function makeUserMessage(text: string, answerValue: unknown): UserMessage {
  return {
    id: makeId(),
    from: "user",
    text,
    answerValue,
    timestamp: nowIso(),
  };
}

function initialState(): ChatbotState {
  return {
    currentStep: INITIAL_STEP,
    history: [],
    messages: [],
    data: {},
    isTyping: false,
    startedAt: null,
  };
}

export interface UseChatbot {
  state: ChatbotState;
  /** Inicia la conversación. No-op si ya está iniciada (no reinicia). */
  start: () => void;
  /** Borra el estado y arranca una conversación nueva desde el greeting. */
  restart: () => void;
  /** Avanza al siguiente step con la respuesta del usuario. `userLabel` es lo
   * que se muestra como burbuja del usuario; pasá `null` para no mostrar nada. */
  send: (answer: unknown, userLabel: string | null) => void;
  /** Reinicia el estado a inicial sin mandar el primer mensaje. */
  reset: () => void;
  /** Cierra (sin guardar). */
  close: () => void;
  /** Construye el log final para guardar en Supabase. */
  buildConversationLog: () => ConversationLog;
}

export function useChatbot(): UseChatbot {
  const { lang } = useLang();
  const [state, setState] = useState<ChatbotState>(initialState);

  const stateRef = useRef<ChatbotState>(state);
  const logRef = useRef<ConversationStepLog[]>([]);
  const startedAtRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);
  const startedRef = useRef<boolean>(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const begin = useCallback(
    (force: boolean) => {
      if (!force && startedRef.current) return;
      startedRef.current = true;

      const now = nowIso();
      startedAtRef.current = now;
      logRef.current = [];
      clearTimers();

      setState({
        currentStep: INITIAL_STEP,
        history: [],
        messages: [],
        data: {},
        isTyping: true,
        startedAt: now,
      });

      const t = window.setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isTyping: false,
          messages: [makeNeoMessage(INITIAL_STEP)],
        }));
      }, NEO_GREETING_DELAY_MS + NEO_TYPING_MS);
      timersRef.current.push(t);
    },
    [clearTimers],
  );

  const start = useCallback(() => begin(false), [begin]);
  const restart = useCallback(() => begin(true), [begin]);

  const send = useCallback(
    (answer: unknown, userLabel: string | null) => {
      const current = stateRef.current;
      if (current.currentStep === "closed") return;

      const result = transition({
        currentStep: current.currentStep,
        data: current.data,
        answer,
      });

      logRef.current = [...logRef.current, result.logEntry];

      const userMessage: ChatMessage | null = userLabel
        ? makeUserMessage(userLabel, answer)
        : null;

      // Paso 1 (inmediato): mostrar burbuja del usuario + activar typing
      setState((prev) => ({
        ...prev,
        messages: userMessage
          ? [...prev.messages, userMessage]
          : prev.messages,
        data: result.data,
        history: [...prev.history, prev.currentStep],
        isTyping: result.nextStep !== "closed",
      }));

      // Paso 2 (delayed): avanzar step + mostrar respuesta de Neo
      const t = window.setTimeout(() => {
        setState((prev) => {
          const isClosing = result.nextStep === "closed";
          return {
            ...prev,
            currentStep: result.nextStep,
            isTyping: false,
            messages: isClosing
              ? prev.messages
              : [...prev.messages, makeNeoMessage(result.nextStep)],
          };
        });
      }, NEO_TYPING_MS);
      timersRef.current.push(t);
    },
    [],
  );

  const reset = useCallback(() => {
    clearTimers();
    startedRef.current = false;
    logRef.current = [];
    startedAtRef.current = null;
    setState(initialState());
  }, [clearTimers]);

  const close = useCallback(() => {
    clearTimers();
    setState((prev) => ({ ...prev, currentStep: "closed", isTyping: false }));
  }, [clearTimers]);

  const buildConversationLog = useCallback(
    (): ConversationLog => ({
      version: 1,
      started_at: startedAtRef.current ?? nowIso(),
      ended_at: nowIso(),
      lang,
      steps: logRef.current,
    }),
    [lang],
  );

  return { state, start, restart, send, reset, close, buildConversationLog };
}
