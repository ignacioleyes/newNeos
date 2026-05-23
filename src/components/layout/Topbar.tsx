import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NeosLogo } from "../ui/NeosLogo";
import { projects } from "../../data/projects";

export function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "text-sm font-medium tracking-wide opacity-80 hover:opacity-100 hover:text-primary transition-colors";

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-base-100/80 backdrop-blur-md border-b border-base-300/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="NEOS home" onClick={closeMobile}>
          <NeosLogo withMark />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={linkClass}>
            Home
          </Link>
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className={`${linkClass} cursor-pointer`}>
              Proyectos
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-lg bg-base-200 border border-base-300/60 rounded-box w-56 mt-2"
            >
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link to={`/proyectos/${p.slug}`} className="text-sm">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/#nosotros" className={linkClass}>
            Nosotros
          </Link>
          <Link to="/#contacto" className={linkClass}>
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/#contacto"
            className="hidden sm:inline-flex btn btn-primary btn-sm rounded-full px-5"
          >
            Contactanos
          </Link>
          <button
            type="button"
            className="md:hidden btn btn-ghost btn-sm btn-square"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 bg-base-100/95 backdrop-blur-md border-t border-base-300/60 ${
          mobileOpen ? "max-h-[28rem]" : "max-h-0"
        }`}
      >
        <ul className="px-6 py-4 space-y-3">
          <li>
            <Link to="/" className={linkClass} onClick={closeMobile}>
              Home
            </Link>
          </li>
          <li>
            <span className="text-xs uppercase tracking-widest opacity-50">Proyectos</span>
            <ul className="mt-2 ml-3 space-y-2">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/proyectos/${p.slug}`}
                    className={linkClass}
                    onClick={closeMobile}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link to="/#nosotros" className={linkClass} onClick={closeMobile}>
              Nosotros
            </Link>
          </li>
          <li>
            <Link to="/#contacto" className={linkClass} onClick={closeMobile}>
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
