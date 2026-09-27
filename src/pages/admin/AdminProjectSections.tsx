import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  useContentQuery,
  useProject,
  useProjectSections,
} from "../../hooks/useContent";
import {
  useAddSection,
  useDeleteSection,
  useReorderSections,
  useUpdateSection,
} from "../../hooks/useSectionMutations";
import { SectionEditor } from "../../components/admin/SectionEditors";
import {
  CANONICAL_ORDER,
  SECTION_HINTS,
  SECTION_LABELS,
  defaultSectionData,
} from "../../lib/sectionDefaults";
import type { SectionKind } from "../../lib/sections";

/**
 * Editor de las secciones de una página de detalle.
 *
 * Es la pieza que convierte el panel en un armador de páginas: qué secciones
 * tiene el proyecto, en qué orden y con qué contenido.
 *
 * Cada sección se guarda por separado, no todo el conjunto junto. Una página
 * puede tener nueve secciones con mucho texto; un único botón de guardar al
 * final obligaría a revisar todo antes de confirmar un cambio chico, y un
 * error en una sección impediría guardar las demás.
 */
export function AdminProjectSections() {
  const { slug } = useParams<{ slug: string }>();
  const { isPending } = useContentQuery();
  const project = useProject(slug);
  const sections = useProjectSections(slug);

  const addSection = useAddSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const reorder = useReorderSections();

  const [openId, setOpenId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!project) {
    if (isPending) return null;
    return <Navigate to="/admin/proyectos" replace />;
  }

  const busy =
    addSection.isPending ||
    updateSection.isPending ||
    deleteSection.isPending ||
    reorder.isPending;

  function run(p: Promise<unknown>) {
    setError(null);
    return p.catch((e: unknown) => {
      setError(e instanceof Error ? e.message : "Algo salió mal. Probá de nuevo.");
      throw e;
    });
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    void run(reorder.mutateAsync(next.map((s) => s.id))).catch(() => {});
  }

  async function save(id: string) {
    const data = drafts[id];
    if (data === undefined) return;
    try {
      await run(updateSection.mutateAsync({ id, data }));
      setDrafts((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
      setSavedId(id);
    } catch {
      /* el mensaje ya se mostró */
    }
  }

  async function add(kind: SectionKind) {
    setAdding(false);
    // Se inserta respetando el orden canónico: si alguien agrega la galería
    // teniendo ya el cierre, cae antes del cierre y no al final de todo.
    const rank = CANONICAL_ORDER.indexOf(kind);
    const before = sections.filter(
      (s) => CANONICAL_ORDER.indexOf(s.kind) <= rank
    ).length;
    try {
      const id = await run(
        addSection.mutateAsync({
          projectId: project!.id,
          kind,
          position: before,
          data: defaultSectionData(kind),
        })
      );
      // Reacomoda las posiciones para que queden 0..n sin huecos ni empates.
      const ordered = [
        ...sections.slice(0, before).map((s) => s.id),
        id as string,
        ...sections.slice(before).map((s) => s.id),
      ];
      await run(reorder.mutateAsync(ordered));
      setOpenId(id as string);
    } catch {
      /* ya se mostró */
    }
  }

  const usedKinds = new Set(sections.map((s) => s.kind));

  return (
    <div className="max-w-4xl pb-16">
      <div className="mb-8">
        <Link
          to={`/admin/proyectos/${project.slug}`}
          className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-primary transition-colors"
        >
          ← {project.name}
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Secciones de la página
        </h1>
        <p className="mt-2 max-w-2xl opacity-60 leading-relaxed">
          Son los bloques de <code className="text-primary">/proyectos/{project.slug}</code>,
          en el orden en que se ven. Un proyecto sin secciones muestra la página
          de «próximamente».
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-error/50 bg-error/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {sections.length === 0 && (
        <p className="mb-6 rounded-xl border border-dashed border-base-300 p-6 text-sm opacity-60 leading-relaxed">
          Esta página todavía no tiene secciones. Empezá por el <b>Hero</b>, que
          es la portada.
        </p>
      )}

      <ul className="space-y-3">
        {sections.map((section, idx) => {
          const isOpen = openId === section.id;
          const draft = drafts[section.id];
          const dirty = draft !== undefined;
          const data = dirty ? draft : section.data;

          return (
            <li
              key={section.id}
              className={`rounded-2xl border bg-base-200 transition-colors ${
                section.isVisible ? "border-base-300/60" : "border-base-300/40 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex flex-col">
                  <button
                    type="button"
                    disabled={idx === 0 || busy}
                    onClick={() => move(idx, -1)}
                    className="btn btn-ghost btn-xs px-2 enabled:hover:text-primary disabled:opacity-20"
                    aria-label={`Subir ${SECTION_LABELS[section.kind]}`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1 || busy}
                    onClick={() => move(idx, 1)}
                    className="btn btn-ghost btn-xs px-2 enabled:hover:text-primary disabled:opacity-20"
                    aria-label={`Bajar ${SECTION_LABELS[section.kind]}`}
                  >
                    ▼
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : section.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="flex items-center gap-2 font-medium">
                    {SECTION_LABELS[section.kind]}
                    {dirty && (
                      <span className="rounded-full border border-warning/50 px-2 py-0.5 text-[9px] uppercase tracking-widest text-warning">
                        sin guardar
                      </span>
                    )}
                    {!section.isVisible && (
                      <span className="rounded-full border border-base-content/30 px-2 py-0.5 text-[9px] uppercase tracking-widest opacity-70">
                        oculta
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-xs opacity-50">
                    {SECTION_HINTS[section.kind]}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void run(
                        updateSection.mutateAsync({
                          id: section.id,
                          isVisible: !section.isVisible,
                        })
                      ).catch(() => {})
                    }
                    className="btn btn-ghost btn-sm rounded-full border border-base-content/20 enabled:hover:border-primary enabled:hover:text-primary transition-colors"
                  >
                    {section.isVisible ? "Ocultar" : "Mostrar"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setConfirmDelete(section.id)}
                    className="btn btn-ghost btn-sm rounded-full border border-base-content/20 enabled:hover:border-error enabled:hover:text-error transition-colors"
                  >
                    Borrar
                  </button>
                  <span className="w-4 text-center text-xs opacity-40">
                    {isOpen ? "▾" : "▸"}
                  </span>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-base-300/60 p-5">
                  <SectionEditor
                    kind={section.kind}
                    slug={project.slug}
                    data={data}
                    onChange={(d) => {
                      setSavedId(null);
                      setDrafts((prev) => ({ ...prev, [section.id]: d }));
                    }}
                  />

                  <div className="mt-4 flex items-center justify-end gap-3 border-t border-base-300/60 pt-4">
                    {savedId === section.id && !dirty && (
                      <span className="text-sm text-success">Guardado.</span>
                    )}
                    {dirty && (
                      <button
                        type="button"
                        onClick={() =>
                          setDrafts((d) => {
                            const next = { ...d };
                            delete next[section.id];
                            return next;
                          })
                        }
                        className="btn btn-ghost btn-sm rounded-full border border-base-content/20"
                      >
                        Descartar
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={!dirty || busy}
                      onClick={() => void save(section.id)}
                      className="btn btn-primary btn-sm rounded-full px-6 disabled:opacity-40"
                    >
                      {updateSection.isPending ? "Guardando…" : "Guardar sección"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Agregar */}
      <div className="mt-6">
        {adding ? (
          <div className="rounded-2xl border border-base-300/60 bg-base-200 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-medium">¿Qué sección querés agregar?</p>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="btn btn-ghost btn-xs"
              >
                ✕
              </button>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {CANONICAL_ORDER.map((kind) => (
                <li key={kind}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void add(kind)}
                    className="w-full rounded-xl border border-base-300/60 bg-base-100 p-3 text-left transition-colors hover:border-primary/60 disabled:opacity-40"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {SECTION_LABELS[kind]}
                      {usedKinds.has(kind) && (
                        <span className="text-[9px] uppercase tracking-widest opacity-45">
                          ya está
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs opacity-50 leading-snug">
                      {SECTION_HINTS[kind]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => setAdding(true)}
            className="btn btn-primary rounded-full px-6 disabled:opacity-40"
          >
            + Agregar sección
          </button>
        )}
      </div>

      {/* Confirmación de borrado */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6">
          <div className="w-full max-w-md rounded-2xl border border-base-300/60 bg-base-200 p-6">
            <h3 className="font-display text-lg font-semibold">
              ¿Borrar esta sección?
            </h3>
            <p className="mt-2 text-sm opacity-70 leading-relaxed">
              Se pierde su contenido. Si sólo querés sacarla de la página por un
              tiempo, conviene <b>ocultarla</b>: queda guardada y se puede volver
              a mostrar cuando quieras.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="btn btn-ghost btn-sm rounded-full border border-base-content/20"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  void run(deleteSection.mutateAsync(confirmDelete))
                    .then(() => setConfirmDelete(null))
                    .catch(() => {});
                }}
                className="btn btn-sm rounded-full border-error bg-error/20 px-5 text-error hover:bg-error hover:text-error-content transition-colors disabled:opacity-40"
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
