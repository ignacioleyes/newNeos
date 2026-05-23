import { NeosMark } from "../ui/NeosMark";
import { TopoPattern } from "../ui/TopoPattern";
import { HeroImageCarousel } from "../ui/HeroImageCarousel";
import { projects } from "../../data/projects";

const heroSlides = projects.map((p) => ({
  src: p.heroImage,
  alt: p.name,
  label: p.name,
  sublabel: p.location,
}));

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-base-100"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-100 to-base-200" />
      <TopoPattern
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[140%] max-w-none text-primary"
        opacity={0.22}
      />
      <NeosMark className="absolute -bottom-32 -right-32 w-[640px] text-primary/10" />

      <div className="relative container mx-auto px-6 lg:px-10 py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <p
            className="hero-in text-xs uppercase tracking-[0.3em] text-primary mb-6"
            style={{ animationDelay: "100ms" }}
          >
            Desarrolladora del Grupo SaltaPor
          </p>
          <h1
            className="hero-in font-display font-semibold leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ animationDelay: "250ms" }}
          >
            Oportunidades<br />
            que se{" "}
            <span className="text-primary italic font-medium">concretan.</span>
          </h1>
          <p
            className="hero-in mt-8 max-w-xl text-base sm:text-lg text-base-content/70 leading-relaxed"
            style={{ animationDelay: "500ms" }}
          >
            Diseñamos, construimos y comercializamos proyectos inmobiliarios
            pensados para vivir e invertir mejor. De Salta a Vaca Muerta.
          </p>
          <div
            className="hero-in mt-10 flex flex-wrap gap-3"
            style={{ animationDelay: "700ms" }}
          >
            <a
              href="#proyectos"
              className="btn btn-primary rounded-full px-6 group"
            >
              Ver proyectos
              <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#contacto"
              className="btn btn-ghost rounded-full px-6 border border-base-content/20 hover:border-primary hover:text-primary"
            >
              Hablar con un asesor
            </a>
          </div>
        </div>

        <div
          className="hero-in lg:col-span-5 relative hidden lg:block"
          style={{ animationDelay: "550ms" }}
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-base-300/60 bg-base-200 shadow-2xl">
            <HeroImageCarousel
              images={heroSlides}
              interval={4500}
              showLabels
              showGradient
            />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="hero-in absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-60"
        style={{ animationDelay: "1100ms" }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">scroll</span>
        <span className="block w-px h-10 bg-gradient-to-b from-base-content/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
