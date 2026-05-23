import { regions } from "../../data/regions";
import { TopoPattern } from "../ui/TopoPattern";
import { Reveal } from "../ui/Reveal";

export function Regions() {
  return (
    <section className="bg-base-100 relative">
      <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <Reveal className="max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Dónde construimos
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            5 regiones, una <em className="not-italic text-primary">misma lectura</em> del territorio.
          </h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {regions.map((r, idx) => (
            <Reveal key={r.slug} delay={idx * 100}>
              <div className="group relative overflow-hidden rounded-xl border border-base-300/60 aspect-[3/4] hover:border-primary/60 transition-colors h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient}`} />
                <TopoPattern
                  className="absolute inset-0 w-full h-full text-primary group-hover:scale-110 transition-transform duration-[1500ms]"
                  opacity={0.3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-[10px] uppercase tracking-widest text-primary mb-1">
                    {r.projectsCount > 0
                      ? `${r.projectsCount} proyecto${r.projectsCount > 1 ? "s" : ""}`
                      : "Próximamente"}
                  </p>
                  <h3 className="font-display text-xl font-semibold leading-tight">
                    {r.name}
                  </h3>
                  <p className="mt-1 text-xs opacity-70 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
