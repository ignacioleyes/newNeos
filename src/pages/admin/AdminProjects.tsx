import { useState } from "react";
import { Link } from "react-router-dom";
import { useAllProjects } from "../../hooks/useContent";
import {
  useReorderProjects,
  useSetFeatured,
  useTogglePublished,
} from "../../hooks/useProjectMutations";
import { GRID_CAPACITY } from "../../lib/presentation";
import { useTr } from "../../i18n/LanguageContext";

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
              {/* Reordenar */}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label={`Subir ${p.name}`}
                  disabled={idx === 0 || busy}
                  onClick={() => move(idx, -1)}
                  className="btn btn-ghost btn-xs px-2 disabled:opacity-20"
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label={`Bajar ${p.name}`}
                  disabled={idx === ordered.length - 1 || busy}
                  onClick={() => move(idx, 1)}
                  className="btn btn-ghost btn-xs px-2 disabled:opacity-20"
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
                  {p.name}
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
                {/* Destacar: sólo tiene sentido si está publicado */}
                <button
                  type="button"
                  disabled={p.isFeatured || busy || !p.isPublished}
                  title={
                    !p.isPublished
                      ? "Publicalo antes de destacarlo"
                      : "Poner como destacado"
                  }
                  onClick={() => run(setFeatured.mutateAsync(p.slug))}
                  className="btn btn-ghost btn-sm rounded-full border border-base-content/20 disabled:opacity-30"
                >
                  ★
                </button>

                <button
                  type="button"
                  disabled={busy || (p.isFeatured && p.isPublished)}
                  title={
                    p.isFeatured && p.isPublished
                      ? "No se puede despublicar el destacado: elegí otro destacado primero"
                      : undefined
                  }
                  onClick={() =>
                    run(
                      togglePublished.mutateAsync({
                        slug: p.slug,
                        published: !p.isPublished,
                      })
                    )
                  }
                  className="btn btn-ghost btn-sm rounded-full border border-base-content/20 disabled:opacity-30"
                >
                  {p.isPublished ? "Despublicar" : "Publicar"}
                </button>

                <Link
                  to={`/proyectos/${p.slug}`}
                  target="_blank"
                  className="btn btn-ghost btn-sm rounded-full border border-base-content/20"
                  title="Ver en la landing"
                >
                  ↗
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
