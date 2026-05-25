import { regions } from "../../data/regions";
import { Reveal } from "../ui/Reveal";
import { RegionMap } from "../ui/RegionMap";
import { useT, useTr } from "../../i18n/LanguageContext";

export function Regions() {
  const t = useT();
  const tr = useTr();

  return (
    <section className="bg-base-100 relative">
      <div className="container mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <Reveal className="max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            {t.regions.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            {t.regions.titleA} <em className="not-italic text-primary">{t.regions.titleHighlight}</em> {t.regions.titleB}
          </h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r, idx) => (
            <Reveal key={r.slug} delay={idx * 100}>
              <div className="group relative overflow-hidden rounded-xl border border-base-300/60 bg-base-200 aspect-[3/4] hover:border-primary/60 transition-colors h-full">
                <RegionMap
                  map={r.map}
                  dots={r.dots}
                  className="group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-base-100 via-base-100/85 to-transparent" />

                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-[10px] uppercase tracking-widest text-primary mb-1">
                    {r.projectsCount > 0
                      ? t.regions.projectsCount(r.projectsCount)
                      : t.regions.comingSoon}
                  </p>
                  <h3 className="font-display text-xl font-semibold leading-tight">
                    {r.name}
                  </h3>
                  <p className="mt-1 text-xs opacity-70 leading-relaxed">
                    {tr(r.description)}
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
