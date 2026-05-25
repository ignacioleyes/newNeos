import { useReveal } from "../../hooks/useReveal";
import { NeosMark } from "../ui/NeosMark";
import { TopoPattern } from "../ui/TopoPattern";
import { useT } from "../../i18n/LanguageContext";

export function About() {
  const ref = useReveal<HTMLDivElement>();
  const t = useT();

  const pills = [
    { k: t.about.pill1Label, v: t.about.pill1Value },
    { k: t.about.pill2Label, v: t.about.pill2Value },
    { k: t.about.pill3Label, v: t.about.pill3Value },
  ];

  return (
    <section
      id="nosotros"
      className="relative bg-base-200 overflow-hidden border-y border-base-300/60"
    >
      <TopoPattern
        className="absolute -left-32 -bottom-32 w-[700px] text-primary"
        opacity={0.15}
      />

      <div
        ref={ref}
        className="reveal relative container mx-auto px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 items-center"
      >
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            {t.about.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            {t.about.titleA} <em className="not-italic text-primary">{t.about.titleHighlight}</em> {t.about.titleB}
          </h2>
          <div className="mt-8 space-y-5 text-base sm:text-lg opacity-80 leading-relaxed max-w-2xl">
            <p>{t.about.body1}</p>
            <p>{t.about.body2}</p>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-6 max-w-xl">
            {pills.map((item) => (
              <div key={item.k} className="border-t border-primary/60 pt-3">
                <p className="text-xs uppercase tracking-widest text-primary">
                  {item.k}
                </p>
                <p className="mt-1 text-sm opacity-80">{item.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 opacity-60">
            <NeosMark className="absolute inset-0 w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
