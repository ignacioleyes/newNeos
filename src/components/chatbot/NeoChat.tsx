import { useEffect, useRef, useState } from "react";
import { useLang, useT } from "../../i18n/LanguageContext";
import {
  STEP_CONFIGS,
  validateEmail,
  validateName,
  validatePhone,
} from "../../chatbot/steps";
import { submitLead } from "../../lib/leadService";
import { useChatbot } from "../../chatbot/useChatbot";
import {
  buildQuickReplies,
  buildSummaryItems,
  buildWhatsAppUrl,
  getProjectName,
  getProjectsForRegion,
  resolveNeoText,
} from "../../chatbot/render";
import { NeoMessage } from "./NeoMessage";
import { NeoProjectCards } from "./NeoProjectCards";
import { NeoQuickReplies } from "./NeoQuickReplies";
import { NeoSummary } from "./NeoSummary";
import { NeoTextInput } from "./NeoTextInput";
import { NeoTyping } from "./NeoTyping";
import { NeoWidget } from "./NeoWidget";

const NEOS_WHATSAPP = "+5493872233240";

interface NeoChatProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Orquestador del chatbot. Combina el state machine (useChatbot) con
 * los componentes UI, renderizando el input area apropiado según el step.
 *
 * Nota: el INSERT real a Supabase se conecta en la tarea #40 — por ahora
 * el "Confirmar y enviar" simula el envío con un timeout.
 */
export function NeoChat({ open, onClose }: NeoChatProps) {
  const t = useT();
  const { lang } = useLang();
  const chat = useChatbot();

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicia la conversación cuando se abre por primera vez (idempotente)
  useEffect(() => {
    if (open) chat.start();
  }, [open, chat]);

  // Auto-scroll al fondo cuando llegan mensajes nuevos o aparece typing
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat.state.messages.length, chat.state.isTyping]);

  const body = (
    <div ref={scrollRef} className="p-4 space-y-3">
      {chat.state.messages.map((msg) => (
        <NeoMessage key={msg.id} from={msg.from}>
          {msg.from === "neo"
            ? resolveNeoText(msg.stepId, chat.state.data, t)
            : msg.text}
        </NeoMessage>
      ))}
      {chat.state.isTyping && <NeoTyping />}
    </div>
  );

  // Sólo rendereamos el footer cuando el widget está abierto y Neo no está
  // tipeando — así el autoFocus de los inputs corre fresh en cada apertura.
  const footer = open && !chat.state.isTyping ? renderInputArea() : null;

  return (
    <NeoWidget open={open} onClose={onClose} footer={footer}>
      {body}
    </NeoWidget>
  );

  function renderInputArea() {
    const { currentStep, data } = chat.state;

    // El step `closed` necesita un escape hatch — sin input area el usuario
    // queda atrapado en el "gracias" sin poder reiniciar.
    if (currentStep === "closed") {
      return (
        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              setSendError(null);
              chat.restart();
            }}
            className="
              w-full px-4 py-2.5 rounded-full text-sm font-semibold
              bg-primary text-white
              hover:bg-primary/90 active:scale-95
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
            "
          >
            {t.neo.steps.closed.restart}
          </button>
        </div>
      );
    }

    const config = STEP_CONFIGS[currentStep];

    switch (config.input) {
      case "quick_replies": {
        const options = buildQuickReplies(currentStep, t);
        return (
          <NeoQuickReplies
            options={options}
            onSelect={(value, label) => chat.send(value, label)}
          />
        );
      }

      case "text_input": {
        if (currentStep === "capture_name") {
          const c = t.neo.steps.capture_name;
          return (
            <NeoTextInput
              type="text"
              placeholder={c.placeholder}
              submitLabel={c.submit}
              validate={(v) =>
                validateName(v).valid ? null : c.errorMin
              }
              onSubmit={(name) => chat.send(name, name)}
            />
          );
        }
        if (currentStep === "capture_contact_value") {
          const c = t.neo.steps.capture_contact_value;
          const isEmail = data.contactChannel !== "phone";
          return (
            <NeoTextInput
              type={isEmail ? "email" : "tel"}
              placeholder={isEmail ? c.placeholderEmail : c.placeholderPhone}
              submitLabel={c.submit}
              validate={(v) => {
                const result = isEmail ? validateEmail(v) : validatePhone(v);
                if (result.valid) return null;
                return isEmail ? c.errorEmail : c.errorPhone;
              }}
              onSubmit={(value) => chat.send(value, value)}
            />
          );
        }
        return null;
      }

      case "project_cards": {
        const list = getProjectsForRegion(data.region, lang);
        const s = t.neo.steps.show_projects;
        return (
          <NeoProjectCards
            projects={list}
            viewProjectLabel={s.viewProject}
            continueLabel={s.continue}
            onContinue={(slug) =>
              chat.send({ slug: slug ?? undefined }, s.continue)
            }
          />
        );
      }

      case "summary": {
        const projectName = getProjectName(data.projectSlug);
        const items = buildSummaryItems(data, t, projectName);
        const c = t.neo.steps.confirm;
        return (
          <NeoSummary
            items={items}
            confirmLabel={c.confirm}
            editLabel={c.edit}
            sendingLabel={t.neo.send.sending}
            retryLabel={t.neo.send.retry}
            sending={sending}
            error={sendError}
            onConfirm={async () => {
              setSending(true);
              setSendError(null);
              try {
                await submitLead({
                  name: chat.state.data.name ?? "",
                  email: chat.state.data.email,
                  phone: chat.state.data.phone,
                  interest: chat.state.data.interest,
                  region: chat.state.data.region,
                  project_slug: chat.state.data.projectSlug,
                  source: "chatbot",
                  lang,
                  conversation: chat.buildConversationLog(),
                });
                chat.send(true, c.confirm);
              } catch {
                setSendError(t.neo.send.error);
              } finally {
                setSending(false);
              }
            }}
            onEdit={() => chat.send(false, c.edit)}
          />
        );
      }

      case "post_send_actions": {
        const c = t.neo.steps.post_send;
        function handleWhatsApp() {
          const url = buildWhatsAppUrl(
            NEOS_WHATSAPP,
            data.name ?? "",
            data.interest,
            data.region,
            t,
          );
          window.open(url, "_blank", "noopener,noreferrer");
          chat.send("whatsapp", c.whatsapp);
        }
        return (
          <div className="p-4 flex gap-2">
            <button
              type="button"
              onClick={() => chat.send("none", c.noThanks)}
              className="
                flex-1 px-4 py-2.5 rounded-full text-sm font-medium
                border border-base-300/70 bg-base-100
                hover:border-primary hover:text-primary
                transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
              "
            >
              {c.noThanks}
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="
                flex-1 px-4 py-2.5 rounded-full text-sm font-semibold
                bg-[#25D366] text-white
                hover:bg-[#1faa54] active:scale-95
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/40
              "
            >
              {c.whatsapp}
            </button>
          </div>
        );
      }

      case "none":
        return null;
    }
  }
}
