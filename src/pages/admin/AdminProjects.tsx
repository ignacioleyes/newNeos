import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAllProjects } from "../../hooks/useContent";
import {
  useReorderProjects,
  useSetFeatured,
  useTogglePublished,
} from "../../hooks/useProjectMutations";
import { GRID_CAPACITY } from "../../lib/presentation";
import { useTr } from "../../i18n/useLanguage";

/**
 * Clases base de los botones de acción.
 *
 * El hover de cada acción señala QUÉ hace, no sólo que es clickeable: las
 * flechas de orden se mueven en la dirección del cambio, la estrella crece,
 * y publicar/despublicar se distinguen por color.
 *
 * Los desplazamientos van bajo `motion-safe:`, así que no se aplican si el
 * sistema pide movimiento reducido. El cambio de color sí queda siempre: es
 * la señal, el movimiento es el condimento.
 *
 * `enabled:` importa — sin eso un botón deshabilitado igual reacciona al
 * hover y promete algo que no va a pasar.
 */
const ORDER_BTN =
  "btn btn-ghost btn-xs px-2 transition-all duration-200 disabled:opacity-20 " +
  "enabled:hover:text-primary enabled:hover:bg-primary/10";

const ACTION_BTN =
  "btn btn-ghost btn-sm rounded-full border border-base-content/20 " +
  "transition-all duration-200 disabled:opacity-30";

/**
 * Tooltip propio, sobre el de daisyUI.
 *
 * Va en un wrapper y no en el propio botón porque `.btn:disabled` tiene
 * `pointer-events: none`: un tooltip puesto sobre el botón deshabilitado no
 * aparecería nunca — y justo ese, el que explica por qué está bloqueado, es el
 * más útil de todos.
 *
 * `--tt-bg` sobreescribe el fondo por defecto (`neutral`, casi igual al de la
 * fila) por `base-300`, que sí se despega.
 *
 * Todos van arriba. El de la última acción se probó a la izquierda, pensando
 * que arriba se cortaría contra el borde: no se corta (el contenedor tiene
 * padding de sobra) y en cambio se superponía con los otros botones.
 *
 * Ojo: el tooltip de daisyUI es CSS puro (contenido en un pseudo-elemento), y
 * los lectores de pantalla no lo anuncian. Por eso los botones que son sólo un
 * ícono llevan además `aria-label`.
 */
function Tip({ text, children }: { text?: string; children: ReactNode }) {
  if (!text) return <>{children}</>;
  return (
    <span
      className="tooltip tooltip-top [--tt-bg:var(--color-base-300)]"
      data-tip={text}
    >
      {children}
    </span>
  );
}

/**
 * Listado de proyectos del panel.
 *
 * El orden de esta lista ES el orden de la grilla de la home: los primeros
 * `GRID_CAPACITY` arman la composición y el resto cae en "Trayectoria". Por eso
 * la lista marca visualmente dónde está el corte, en vez de dejarlo implícito.
 */
export function AdminProjects() {
  const projects = useAllProjects();
  const tr = useTr();

  const togglePublished = useTogglePublished();
  const setFeatured = useSetFeatured();
  const reorder = useReorderProjects();
  const [error, setError] = useState<string | null>(null);

  const ordered = [...projects].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.displayOrder - b.displayOrder;
  });

  const busy =
    togglePublished.isPending || setFeatured.isPending || reorder.isPending;

  function run(p: Promise<unknown>) {
    setError(null);
    p.catch((e: unknown) =>
      setError(e instanceof Error ? e.message : "Algo salió mal. Probá de nuevo.")
    );
  }

  function move(index: number, delta: number) {
    const next = [...ordered];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    run(reorder.mutateAsync(next.map((p) => p.slug)));
  }

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Proyectos</h1>
        <p className="text-sm opacity-60">
          {projects.filter((p) => p.isPublished).length} publicados de {projects.length}
        </p>
      </div>
      <p className="opacity-60 mb-8 max-w-2xl leading-relaxed">
        El orden de esta lista es el de la grilla de la home. Los primeros{" "}
        {GRID_CAPACITY} arman la composición; los que queden abajo del corte
        aparecen en «Trayectoria».
      </p>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-error/50 bg-error/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <ul className="space-y-2 max-w-4xl">
        {ordered.map((p, idx) => (
          <li key={p.slug}>
            {idx === GRID_CAPACITY && (
              <div className="flex items-center gap-3 py-4 text-[10px] uppercase tracking-widest opacity-50">
                <span className="h-px flex-1 bg-base-300" />
                Corte de la grilla · lo de abajo va en Trayectoria
                <span className="h-px flex-1 bg-base-300" />
              </div>
            )}

            <div
              className={`flex items-center gap-4 rounded-xl border bg-base-200 p-3 pr-4 transition-opacity ${
                p.isFeatured ? "border-primary/60" : "border-base-300/60"
              } ${p.isPublished ? "" : "opacity-55"}`}
            >
              {/* Reordenar. El hover empuja la flecha en la dirección del
                  movimiento: la de subir se va hacia arriba. Es affordance,
                  no decoración — antes de hacer click ya sabés qué va a pasar. */}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label={`Subir ${p.name}`}
                  disabled={idx === 0 || busy}
                  onClick={() => move(idx, -1)}
                  className={`${ORDER_BTN} motion-safe:enabled:hover:-translate-y-0.5`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label={`Bajar ${p.name}`}
                  disabled={idx === ordered.length - 1 || busy}
                  onClick={() => move(idx, 1)}
                  className={`${ORDER_BTN} motion-safe:enabled:hover:translate-y-0.5`}
                >
                  ▼
                </button>
              </div>

              <img
                src={p.heroImage}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium truncate">
                  <Link
                    to={`/admin/proyectos/${p.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {p.name}
                  </Link>
                  {p.isFeatured && (
                    <span className="rounded-full border border-primary/50 px-2 py-0.5 text-[9px] uppercase tracking-widest text-primary">
                      Destacado
                    </span>
                  )}
                  {!p.isPublished && (
                    <span className="rounded-full border border-base-content/30 px-2 py-0.5 text-[9px] uppercase tracking-widest opacity-70">
                      Borrador
                    </span>
                  )}
                </p>
                <p className="truncate text-xs opacity-55">
                  {tr(p.location)} · {tr(p.statusLabel)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Destacar. La estrella crece y se pinta: previsualiza el
                    estado en el que va a quedar. */}
                <Tip
                  text={
                    !p.isPublished
                      ? "Publicalo antes de destacarlo"
                      : p.isFeatured
                        ? "Ya es el destacado"
                        : "Poner como destacado"
                  }
                >
                  <button
                    type="button"
                    aria-label={`Destacar ${p.name}`}
                    disabled={p.isFeatured || busy || !p.isPublished}
                    onClick={() => run(setFeatured.mutateAsync(p.slug))}
                    className={`${ACTION_BTN} text-base leading-none enabled:hover:text-primary enabled:hover:border-primary enabled:hover:bg-primary/10 motion-safe:enabled:hover:scale-110`}
                  >
                    ★
                  </button>
                </Tip>

                {/* Publicar y despublicar son la misma acción con signo
                    opuesto, así que el hover las distingue por color: rosa
                    suma a la landing, ámbar la saca. Ámbar y no rojo porque es
                    reversible — no se borra nada.

                    El tooltip sólo aparece cuando está bloqueado: el botón ya
                    dice qué hace, así que explicarlo de nuevo sería ruido. */}
                <Tip
                  text={
                    p.isFeatured && p.isPublished
                      ? "Elegí otro destacado antes de despublicar este"
                      : undefined
                  }
                >
                  <button
                    type="button"
                    disabled={busy || (p.isFeatured && p.isPublished)}
                    onClick={() =>
                      run(
                        togglePublished.mutateAsync({
                          slug: p.slug,
                          published: !p.isPublished,
                        })
                      )
                    }
                    className={`${ACTION_BTN} ${
                      p.isPublished
                        ? "enabled:hover:text-warning enabled:hover:border-warning enabled:hover:bg-warning/10"
                        : "enabled:hover:text-primary enabled:hover:border-primary enabled:hover:bg-primary/10"
                    }`}
                  >
                    {p.isPublished ? "Despublicar" : "Publicar"}
                  </button>
                </Tip>

                {/* Abre en otra pestaña: la flecha se va en diagonal, hacia
                    donde apunta. */}
                <Tip text="Editar las secciones de la página">
                  <Link
                    to={`/admin/proyectos/${p.slug}/secciones`}
                    aria-label={`Secciones de ${p.name}`}
                    className={`${ACTION_BTN} text-base leading-none hover:text-primary hover:border-primary hover:bg-primary/10`}
                  >
                    ☰
                  </Link>
                </Tip>

                <Tip text="Ver en la landing">
                  <Link
                    to={`/proyectos/${p.slug}`}
                    target="_blank"
                    aria-label={`Ver ${p.name} en la landing`}
                    className={`${ACTION_BTN} text-base leading-none hover:text-primary hover:border-primary hover:bg-primary/10 motion-safe:hover:-translate-y-0.5 motion-safe:hover:translate-x-0.5`}
                  >
                    ↗
                  </Link>
                </Tip>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
