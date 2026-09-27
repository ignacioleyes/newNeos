import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProjectImages } from "../../lib/imageUpload";

/**
 * Elige una imagen de las que ya tiene el proyecto.
 *
 * Editar galerías pegando URLs a mano sería inusable: son URLs largas de
 * Storage y nadie las recuerda. Acá se ven las miniaturas y se elige.
 *
 * Deliberadamente no sube: para eso está la galería del formulario del
 * proyecto, que además muestra el ahorro de peso y los usos de cada imagen.
 * Duplicar la subida en cada campo repartiría esa información en diez lugares.
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
  const { data: images } = useQuery({
    queryKey: ["project-images", slug],
    queryFn: () => listProjectImages(slug),
    staleTime: 60_000,
  });

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

      {open && (
        <div className="mt-3 rounded-xl border border-base-300/60 bg-base-100 p-3">
          {!images ? (
            <p className="text-xs opacity-50">Cargando…</p>
          ) : images.length === 0 ? (
            <p className="text-xs opacity-60">
              Este proyecto no tiene imágenes. Subilas desde la sección Imágenes
              del formulario del proyecto.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
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
        </div>
      )}
    </div>
  );
}
