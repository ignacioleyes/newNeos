import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../../data/projects";
import { NeosMark } from "../ui/NeosMark";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const socials = [
  { label: "IG", href: "https://www.instagram.com/neos.ok", title: "Instagram" },
  { label: "FB", href: "https://www.facebook.com/neosdesarrollos", title: "Facebook" },
  { label: "LI", href: "https://www.linkedin.com/company/neos-comercializadoragsp/", title: "LinkedIn" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const [projectsExpanded, setProjectsExpanded] = useState(false);

  // Body scroll lock while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset accordion when menu closes
  useEffect(() => {
    if (!open) setProjectsExpanded(false);
  }, [open]);

  const itemBase =
    "group relative block py-3 font-display text-4xl lg:text-5xl font-semibold tracking-tight hover:text-primary transition-colors";

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={`absolute top-0 right-0 h-full w-full sm:w-[480px] lg:w-[60vw] xl:w-[640px] bg-base-100/95 backdrop-blur-xl border-l border-base-300/60 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top bar of the panel */}
        <div className="px-8 lg:px-12 h-16 flex items-center justify-end border-b border-base-300/40">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="group flex items-center gap-3 text-xs uppercase tracking-[0.3em] opacity-80 hover:text-primary hover:opacity-100 transition-colors"
          >
            <span>Cerrar</span>
            <span className="relative w-5 h-5">
              <span className="absolute top-1/2 left-0 w-full h-px bg-current rotate-45 group-hover:rotate-[135deg] transition-transform" />
              <span className="absolute top-1/2 left-0 w-full h-px bg-current -rotate-45 group-hover:rotate-[45deg] transition-transform" />
            </span>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-8 lg:px-12 py-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
            Navegación
          </p>

          <ul className="space-y-1">
            <li>
              <Link to="/" onClick={onClose} className={itemBase}>
                <span className="inline-flex items-center gap-4">
                  <span className="block w-6 h-px bg-primary opacity-0 group-hover:opacity-100 group-hover:w-10 transition-all duration-300" />
                  Inicio
                </span>
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setProjectsExpanded((v) => !v)}
                aria-expanded={projectsExpanded}
                className={`${itemBase} flex items-center justify-between w-full`}
              >
                <span className="inline-flex items-center gap-4">
                  <span
                    className={`block h-px bg-primary transition-all duration-300 ${
                      projectsExpanded
                        ? "w-10 opacity-100"
                        : "w-6 opacity-0 group-hover:opacity-100 group-hover:w-10"
                    }`}
                  />
                  Proyectos
                </span>
                <span
                  className={`text-2xl font-light leading-none transition-transform duration-300 ${
                    projectsExpanded ? "rotate-45 text-primary" : ""
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-500 ${
                  projectsExpanded ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="pl-10 py-2 space-y-1">
                  {projects.map((p, idx) => (
                    <li
                      key={p.slug}
                      style={{
                        transitionDelay: projectsExpanded
                          ? `${100 + idx * 60}ms`
                          : "0ms",
                      }}
                      className={`transition-all duration-500 ${
                        projectsExpanded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4"
                      }`}
                    >
                      <Link
                        to={`/proyectos/${p.slug}`}
                        onClick={onClose}
                        className="group/sub flex items-baseline gap-3 py-2 text-lg lg:text-xl opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                      >
                        <span className="text-[10px] uppercase tracking-widest opacity-50 w-6">
                          0{idx + 1}
                        </span>
                        <span>{p.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li>
              <Link to="/#nosotros" onClick={onClose} className={itemBase}>
                <span className="inline-flex items-center gap-4">
                  <span className="block w-6 h-px bg-primary opacity-0 group-hover:opacity-100 group-hover:w-10 transition-all duration-300" />
                  Nosotros
                </span>
              </Link>
            </li>

            <li>
              <Link to="/#contacto" onClick={onClose} className={itemBase}>
                <span className="inline-flex items-center gap-4">
                  <span className="block w-6 h-px bg-primary opacity-0 group-hover:opacity-100 group-hover:w-10 transition-all duration-300" />
                  Contacto
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Panel footer */}
        <div className="px-8 lg:px-12 py-8 border-t border-base-300/40 space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
              Conectá
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-base-300/60 hover:border-primary hover:text-primary text-xs font-medium transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="text-sm space-y-1">
            <a
              href="mailto:info@neos.ar"
              className="block opacity-80 hover:text-primary hover:opacity-100 transition"
            >
              info@neos.ar
            </a>
            <a
              href="tel:+5493872233240"
              className="block opacity-80 hover:text-primary hover:opacity-100 transition"
            >
              +54 9 387 223 3240
            </a>
            <p className="opacity-60 text-xs">
              Leguizamón 1946 · Salta · Argentina
            </p>
          </div>

          <div className="flex justify-end opacity-20 pt-2">
            <NeosMark className="h-10 w-10 text-primary" />
          </div>
        </div>
      </aside>
    </div>
  );
}
