import { Link } from "react-router-dom";
import { NeosLogo } from "../ui/NeosLogo";
import { TopoPattern } from "../ui/TopoPattern";
import { projects } from "../../data/projects";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/neos.ok" },
  { label: "Facebook", href: "https://www.facebook.com/neosdesarrollos" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/neos-comercializadoragsp/" },
];

export function Footer() {
  return (
    <footer className="relative bg-base-100 text-base-content/80 border-t border-base-300/60 overflow-hidden">
      <TopoPattern
        className="absolute -right-40 -bottom-40 w-[700px] text-primary"
        opacity={0.18}
      />

      <div className="relative container mx-auto px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <NeosLogo withMark className="text-base-content" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-70">
            Desarrolladora del Grupo SaltaPor. Oportunidades que se concretan.
          </p>
          <ul className="mt-6 flex gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-base-300/60 hover:border-primary hover:text-primary transition-colors text-xs font-medium"
                  aria-label={s.label}
                >
                  {s.label[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            Contacto
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="tel:+5493872233240" className="hover:text-primary transition-colors">
                +54 9 387 223 3240
              </a>
            </li>
            <li>
              <a href="mailto:info@neos.ar" className="hover:text-primary transition-colors">
                info@neos.ar
              </a>
            </li>
            <li className="opacity-80">Leguizamón 1946 · Salta · Argentina</li>
            <li className="opacity-80">0387 146 328 278</li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            Proyectos
          </h3>
          <ul className="space-y-2 text-sm">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/proyectos/${p.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-base-300/60">
        <div className="container mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-60">
          <p>© {new Date().getFullYear()} NEOS · Grupo SaltaPor. Todos los derechos reservados.</p>
          <p>Hecho con cariño desde el norte argentino.</p>
        </div>
      </div>
    </footer>
  );
}
