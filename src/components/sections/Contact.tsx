import { useState, type FormEvent } from "react";
import { useReveal } from "../../hooks/useReveal";
import { TopoPattern } from "../ui/TopoPattern";
import { useT } from "../../i18n/LanguageContext";

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

const initial: FormState = { nombre: "", email: "", telefono: "", mensaje: "" };

export function Contact() {
  const ref = useReveal<HTMLDivElement>();
  const t = useT();
  const [form, setForm] = useState<FormState>(initial);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submission (placeholder):", form);
    setSent(true);
    setForm(initial);
    setTimeout(() => setSent(false), 6000);
  }

  return (
    <section
      id="contacto"
      className="relative bg-base-100 overflow-hidden border-t border-base-300/60"
    >
      <TopoPattern
        className="absolute -left-40 top-10 w-[800px] text-primary"
        opacity={0.25}
      />
      <TopoPattern
        className="absolute -right-40 bottom-10 w-[700px] text-primary"
        opacity={0.18}
      />

      <div
        ref={ref}
        className="reveal relative container mx-auto px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start"
      >
        <div className="lg:sticky lg:top-32">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            {t.contact.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            {t.contact.titleA}<br />
            <em className="not-italic text-primary">{t.contact.titleHighlight}</em>{t.contact.titleB}
          </h2>
          <p className="mt-6 opacity-75 max-w-md leading-relaxed">
            {t.contact.subtitle}
          </p>

          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <div>
                <p className="text-xs uppercase tracking-widest opacity-60">{t.common.email}</p>
                <a href="mailto:info@neos.ar" className="hover:text-primary">
                  info@neos.ar
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <div>
                <p className="text-xs uppercase tracking-widest opacity-60">{t.common.whatsapp}</p>
                <a href="https://wa.me/5493872233240" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  +54 9 387 223 3240
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <div>
                <p className="text-xs uppercase tracking-widest opacity-60">{t.common.office}</p>
                <p>{t.common.address}</p>
              </div>
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-base-200/80 backdrop-blur-md border border-base-300/60 rounded-2xl p-8 lg:p-10 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="block text-xs uppercase tracking-widest opacity-70 mb-2">
                {t.contact.fName}
              </span>
              <input
                required
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full bg-base-100 border border-base-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
              />
            </label>
            <label className="block">
              <span className="block text-xs uppercase tracking-widest opacity-70 mb-2">
                {t.contact.fEmail}
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-base-100 border border-base-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
              />
            </label>
          </div>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest opacity-70 mb-2">
              {t.contact.fPhone}
            </span>
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full bg-base-100 border border-base-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest opacity-70 mb-2">
              {t.contact.fMessage} <span className="opacity-50">{t.contact.fMessageOptional}</span>
            </span>
            <textarea
              rows={4}
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              className="w-full bg-base-100 border border-base-300 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary w-full rounded-full text-base h-12"
          >
            {sent ? t.contact.submitted : t.contact.submit}
          </button>
          <p className="text-xs opacity-60 text-center">{t.contact.disclaimer}</p>
        </form>
      </div>
    </section>
  );
}
