import { useReveal } from "../../hooks/useReveal";
import { TopoPattern } from "../ui/TopoPattern";

export function BrochureCTA() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="bg-base-100 py-16">
      <div className="container mx-auto px-6 lg:px-10">
        <div
          ref={ref}
          className="reveal relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-base-200 to-base-200 px-8 py-14 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <TopoPattern
            className="absolute -right-20 -top-20 w-[600px] text-primary"
            opacity={0.2}
          />
          <div className="relative max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Material institucional
            </p>
            <h3 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
              Descargá el portfolio NEOS.
            </h3>
            <p className="mt-4 opacity-80">
              Brochure consolidado con todos los proyectos, plantas y datos de
              inversión.
            </p>
          </div>
          <a
            href="#contacto"
            className="relative btn btn-primary rounded-full px-8 text-base"
          >
            Solicitar brochure →
          </a>
        </div>
      </div>
    </section>
  );
}
