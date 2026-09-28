import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listProjectImages, uploadProjectImage } from "../../lib/imageUpload";

/**
 * Elige una imagen del proyecto, o sube una nueva sin salir de acá.
 *
 * Editar galerías pegando URLs a mano sería inusable: son URLs largas de
 * Storage y nadie las recuerda.
 *
 * La primera versión no dejaba subir: la idea era que la subida viviera en un
 * solo lugar (la galería del formulario del proyecto) para no repartir en diez
 * pantallas la info de ahorro de peso y de usos. Estaba mal. Los borradores de
 * sección viven en el estado del componente, así que irse a otra página a subir
 * una imagen hace perder lo que se estaba editando — justo en el peor momento.
 * La galería del formulario sigue siendo el lugar para administrar (ver todo,
 * borrar, saber dónde se usa cada una); acá sólo se agrega lo que hace falta.
 */
export function ImagePicker({
  slug,
  value,
  onChange,
  onClear,
  label = "Imagen",
}: {
  slug: string;
  value: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: images } = useQuery({
    queryKey: ["project-images", slug],
    queryFn: () => listProjectImages(slug),
    staleTime: 60_000,
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      // Con varias, la última queda seleccionada: es la que quedó "arriba" en
      // la cabeza de quien las eligió.
      let lastUrl = "";
      for (const file of Array.from(files)) {
        const { image } = await uploadProjectImage(slug, file);
        lastUrl = image.url;
      }
      // Invalida la lista compartida: la galería del formulario y los demás
      // selectores de la página ven las nuevas sin recargar.
      await queryClient.invalidateQueries({ queryKey: ["project-images", slug] });
      if (lastUrl) {
        onChange(lastUrl);
        setOpen(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mb-4">
      <p className="mb-2 text-[10px] uppercase tracking-widest text-primary">{label}</p>

      <div className="flex items-start gap-3">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-base-300/60 bg-base-300/30">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full place-items-center text-[10px] opacity-40">
              sin imagen
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="btn btn-ghost btn-xs rounded-full border border-base-content/20 hover:border-primary hover:text-primary transition-colors"
          >
            {open ? "Cerrar" : value ? "Cambiar" : "Elegir"}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="btn btn-ghost btn-xs rounded-full border border-base-content/20 enabled:hover:border-primary enabled:hover:text-primary transition-colors disabled:opacity-40"
          >
            {uploading ? "Subiendo…" : "Subir"}
          </button>
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="btn btn-ghost btn-xs rounded-full border border-base-content/20 hover:border-error hover:text-error transition-colors"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {error && (
        <p role="alert" className="mt-2 text-xs text-error leading-snug">
          {error}
        </p>
      )}

      {open && (
        <div className="mt-3 rounded-xl border border-base-300/60 bg-base-100 p-3">
          {!images ? (
            <p className="text-xs opacity-50">Cargando…</p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {/* Subir como primera celda: si la galería está vacía, la acción
                  que hace falta está donde se la busca. */}
              <li>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                  className="grid aspect-[4/3] w-full place-items-center rounded-lg border border-dashed border-base-300 text-center text-[10px] leading-tight opacity-70 transition-colors enabled:hover:border-primary enabled:hover:text-primary disabled:opacity-40"
                >
                  {uploading ? "Subiendo…" : "+ Subir"}
                </button>
              </li>

              {images.map((img) => (
                <li key={img.path}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(img.url);
                      setOpen(false);
                    }}
                    title={img.name}
                    className={`block w-full overflow-hidden rounded-lg border transition-colors ${
                      img.url === value
                        ? "border-primary"
                        : "border-base-300/60 hover:border-primary/60"
                    }`}
                  >
                    <span className="block aspect-[4/3]">
                      <img
                        src={img.url}
                        alt={img.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 text-[10px] opacity-45 leading-snug">
            Se achican a 1920 px y se convierten a WebP antes de subir. Para
            borrar o ver dónde se usa cada una, andá a Imágenes en el formulario
            del proyecto.
          </p>
        </div>
      )}
    </div>
  );
}
