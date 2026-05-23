import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NeosLogo } from "../ui/NeosLogo";
import { Sidebar } from "./Sidebar";

export function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-base-100/70 backdrop-blur-md border-b border-base-300/40"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center"
            aria-label="NEOS home"
          >
            <NeosLogo withMark />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="group flex items-center gap-3 text-sm font-medium tracking-wide hover:text-primary transition-colors"
          >
            <span className="hidden sm:inline opacity-80 group-hover:opacity-100 uppercase text-xs tracking-[0.25em]">
              Menú
            </span>
            <span
              className="relative inline-block w-7 h-5"
              aria-hidden="true"
            >
              <span className="absolute top-0 left-0 w-full h-px bg-current transition-transform" />
              <span className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-px bg-current group-hover:w-full transition-all duration-300" />
              <span className="absolute bottom-0 left-0 w-full h-px bg-current transition-transform" />
            </span>
          </button>
        </div>
      </header>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
