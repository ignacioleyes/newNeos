import { pillars } from "../../data/pillars";
import { CountUp } from "../ui/CountUp";
import { Reveal } from "../ui/Reveal";
import { useTr } from "../../i18n/useLanguage";

export function Pillars() {
  const tr = useTr();
  return (
    <section className="bg-base-200 border-y border-base-300/60">
      {/* 4 columnas recién desde xl (1280) y no desde lg (1024): a 1024 cada
          columna queda en ~180px y "+50.000 m²" no entra de ninguna manera.
          Entre 1024 y 1280 se ven mejor 2 columnas anchas que 4 apretadas. */}
      <div className="container mx-auto px-6 lg:px-10 py-20 grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
        {pillars.map((p, idx) => (
          <Reveal key={tr(p.label)} delay={idx * 120}>
            <div className="border-l-2 border-primary pl-5">
              {/* `whitespace-nowrap` y el tamaño reducido en lg resuelven un
                  bug que sólo se veía con la métrica más larga: "+50.000 m²"
                  necesitaba 311px y la columna daba 309, así que el "m²" caía
                  a una segunda línea y empujaba la etiqueta 30px hacia abajo,
                  desalineándola de las otras tres.

                  Durante el conteo era peor: el número cruza ese umbral varias
                  veces mientras sube, así que la etiqueta saltaba.

                  `tabular-nums` da a todos los dígitos el mismo ancho. Sin eso
                  el número tiembla mientras cuenta, porque un 1 es más angosto
                  que un 8.

                  De xl para arriba el tamaño es fluido y no fijo: ahí la grilla
                  pasa a 4 columnas, y una columna a 1280 mide bastante menos
                  que a 1920. Con un tamaño fijo, o entra en la pantalla grande
                  y se desborda en la chica, o entra en la chica y se ve
                  diminuto en la grande. */}
              <p className="font-display text-5xl xl:text-[clamp(2rem,3vw,3.5rem)] font-semibold tracking-tight leading-none whitespace-nowrap tabular-nums">
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
