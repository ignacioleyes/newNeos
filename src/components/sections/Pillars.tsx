import { pillars } from "../../data/pillars";
import { CountUp } from "../ui/CountUp";
import { Reveal } from "../ui/Reveal";
import { useTr } from "../../i18n/LanguageContext";

export function Pillars() {
  const tr = useTr();
  return (
    <section className="bg-base-200 border-y border-base-300/60">
      <div className="container mx-auto px-6 lg:px-10 py-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, idx) => (
          <Reveal key={tr(p.label)} delay={idx * 120}>
            <div className="border-l-2 border-primary pl-5">
              <p className="font-display text-5xl lg:text-6xl font-semibold tracking-tight leading-none">
                <CountUp
                  target={p.value}
                  prefix={p.prefix}
                  suffix={p.suffix}
                />
              </p>
              <p className="mt-3 text-sm uppercase tracking-widest text-primary">
                {tr(p.label)}
              </p>
              <p className="mt-2 text-sm opacity-70 leading-relaxed">
                {tr(p.description)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
