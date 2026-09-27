import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProjectImage,
  listProjectImages,
  uploadProjectImage,
  type StoredImage,
} from "../../lib/imageUpload";
import { findImageUsages } from "../../lib/imageUsage";

import type { ProjectSection } from "../../lib/sections";

/**
 * Galería de imágenes de un proyecto.
 *
 * Sirve para dos cosas a la vez: ver y limpiar lo que hay, y elegir la imagen
 * principal o el logo sin tener que escribir una ruta a mano.
 *
 * Al borrar se muestra en qué secciones se está usando la imagen y se pide
 * confirmación, pero no se bloquea. El admin sabe lo que hace; lo que no puede
 * es enterarse después.
 */

function kb(bytes: number): string {
  return bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

export function ProjectImages({
  slug,
  heroImage,
  logo,
  sections,
  onPickHero,
  onPickLogo,
}: {
  slug: string;
  /** Valores actuales del formulario, para que los tildes y los avisos no
   * mientan mientras hay cambios sin guardar. */
  heroImage: string;
  logo: string;
  sections: ProjectSection[];
  onPickHero: (url: string) => void;
  onPickLogo: (url: string) => void;
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<StoredImage | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // El listado va por TanStack Query, igual que el resto de los datos de la
  // app: da el refetch y la invalidación gratis, y evita hacer fetch a mano
  // dentro de un efecto.
  const imagesQuery = useQuery({
    queryKey: ["project-images", slug],
    queryFn: () => listProjectImages(slug),
    // El bucket sólo cambia desde acá, no hace falta revalidar al volver.
    staleTime: 60_000,
  });
  const images = imagesQuery.data ?? null;

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["project-images", slug] });
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    setNote(null);

    let saved = 0;
    let originals = 0;
    try {
      for (const file of Array.from(files)) {
        const { image, originalSize } = await uploadProjectImage(slug, file);
        originals += originalSize;
        saved += image.size;
      }
      // Mostrar el ahorro enseña por qué existe el redimensionado.
      setNote(
        `Listo: ${kb(originals)} → ${kb(saved)} después de optimizar.`
      );
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(image: StoredImage) {
    setBusy(true);
    setError(null);
    try {
      await deleteProjectImage(image.path);
      setConfirming(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo borrar la imagen.");
    } finally {
      setBusy(false);
    }
  }

  const usagesOfConfirming = confirming
    ? findImageUsages(confirming.url, { heroImage, logo }, sections)
    : [];

  return (
    <section className="mb-10">
      <h2 className="mb-5 border-b border-base-300/60 pb-2 font-display text-lg font-semibold">
        Imágenes
      </h2>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="btn btn-primary btn-sm rounded-full px-5 disabled:opacity-40"
        >
          {busy ? "Procesando…" : "Subir imágenes"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <p className="text-xs opacity-50 leading-snug">
          Se achican a 1920 px y se convierten a WebP antes de subir. Podés
          arrastrar varias a la vez.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-error/50 bg-error/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {note && <p className="mb-4 text-sm text-success">{note}</p>}

      {imagesQuery.isError ? (
        <p className="text-sm text-error">
          No se pudieron cargar las imágenes:{" "}
          {imagesQuery.error instanceof Error ? imagesQuery.error.message : ""}
        </p>
      ) : images === null ? (
        <p className="text-sm opacity-50">Cargando…</p>
      ) : images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-base-300 p-6 text-sm opacity-60">
          Este proyecto todavía no tiene imágenes.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => {
            const usages = findImageUsages(img.url, { heroImage, logo }, sections);
            const isHero = heroImage === img.url;
            const isLogo = logo === img.url;

            return (
              <li
                key={img.path}
                className="overflow-hidden rounded-xl border border-base-300/60 bg-base-200"
              >
                <div className="relative aspect-[4/3] bg-base-300/40">
                  <img
                    src={img.url}
                    alt={img.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {usages.length > 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-base-100/85 px-2 py-0.5 text-[9px] uppercase tracking-widest text-primary backdrop-blur">
                      en uso
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <p className="truncate text-xs" title={img.name}>
                    {img.name}
                  </p>
                  <p className="mt-0.5 text-[10px] opacity-45">{kb(img.size)}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={isHero}
                      onClick={() => onPickHero(img.url)}
                      className="btn btn-ghost btn-xs rounded-full border border-base-content/20 enabled:hover:border-primary enabled:hover:text-primary transition-colors disabled:opacity-30"
                    >
                      {isHero ? "✓ Principal" : "Principal"}
                    </button>
                    <button
                      type="button"
                      disabled={isLogo}
                      onClick={() => onPickLogo(img.url)}
                      className="btn btn-ghost btn-xs rounded-full border border-base-content/20 enabled:hover:border-primary enabled:hover:text-primary transition-colors disabled:opacity-30"
                    >
                      {isLogo ? "✓ Logo" : "Logo"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirming(img)}
                      className="btn btn-ghost btn-xs rounded-full border border-base-content/20 enabled:hover:border-error enabled:hover:text-error transition-colors disabled:opacity-30"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Confirmación de borrado */}
      {confirming && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6">
          <div className="w-full max-w-md rounded-2xl border border-base-300/60 bg-base-200 p-6">
            <h3 className="font-display text-lg font-semibold">
              ¿Borrar esta imagen?
            </h3>
            <p className="mt-1 truncate text-sm opacity-60">{confirming.name}</p>

            {usagesOfConfirming.length > 0 ? (
              <div className="mt-4 rounded-xl border border-warning/50 bg-warning/10 p-4">
                <p className="text-sm font-medium text-warning">
                  Se está usando en {usagesOfConfirming.length}{" "}
                  {usagesOfConfirming.length === 1 ? "lugar" : "lugares"}:
                </p>
                <ul className="mt-2 space-y-0.5 text-sm opacity-85">
                  {usagesOfConfirming.map((u) => (
                    <li key={u}>· {u}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs opacity-70 leading-relaxed">
                  Si la borrás, esos lugares van a quedar con una imagen rota
                  hasta que pongas otra.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm opacity-70">
                No se está usando en ninguna parte de este proyecto.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(null)}
                className="btn btn-ghost btn-sm rounded-full border border-base-content/20"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleDelete(confirming)}
                className="btn btn-sm rounded-full border-error bg-error/20 px-5 text-error hover:bg-error hover:text-error-content transition-colors disabled:opacity-40"
              >
                {busy ? "Borrando…" : "Borrar igual"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
