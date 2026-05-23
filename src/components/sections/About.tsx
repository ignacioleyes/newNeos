import { useReveal } from "../../hooks/useReveal";
import { NeosMark } from "../ui/NeosMark";
import { TopoPattern } from "../ui/TopoPattern";

export function About() {
  const ref = useReveal<HTMLDivElement>();

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
            Quiénes somos
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            Una desarrolladora que <em className="not-italic text-primary">construye futuro</em> en cada región.
          </h2>
          <div className="mt-8 space-y-5 text-base sm:text-lg opacity-80 leading-relaxed max-w-2xl">
            <p>
              NEOS es la desarrolladora del Grupo SaltaPor. Diseñamos productos
              inmobiliarios pensando en ubicación, escala humana, diseño y
              rentabilidad — para que vivir, descansar e invertir sean parte de
              la misma decisión.
            </p>
            <p>
              Operamos desde Salta capital hasta Vaca Muerta, leyendo cada
              territorio para transformar potencial regional en oportunidades
              que se concretan.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-6 max-w-xl">
            {[
              { k: "Diseño", v: "Arquitectura contemporánea" },
              { k: "Respaldo", v: "Grupo SaltaPor" },
              { k: "Foco", v: "Inversión + lifestyle" },
            ].map((item) => (
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
          <div className="relative w-72 h-72 lg:w-96 lg:h-96">
            <NeosMark className="absolute inset-0 w-full h-full text-primary/80" />
            <NeosMark className="absolute inset-0 w-full h-full text-primary/20 rotate-45 scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
}
