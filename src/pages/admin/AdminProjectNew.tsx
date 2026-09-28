import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAllProjects, useRegions } from "../../hooks/useContent";
import { useCreateProject } from "../../hooks/useProjectMutations";
import { LocalizedField, SelectField, TextField } from "../../components/admin/Field";
import type { Localized } from "../../i18n/types";

/**
 * Alta de un proyecto.
 *
 * Pide sólo lo que la base exige, no los veinte campos del formulario de
 * edición. Un alta larga invita a llenar cualquier cosa con tal de terminar;
 * el resto se completa después, con el proyecto ya creado y en borrador.
 *
 * Arranca despublicado y sin imagen. Las fotos se suben desde el formulario de
 * edición, que es cuando ya existe la carpeta del slug en Storage.
 */

const STATUS_OPTIONS = [
  { value: "anteproyecto", label: "Anteproyecto" },
  { value: "en-obra", label: "En obra" },
  { value: "lanzamiento", label: "Lanzamiento" },
  { value: "finalizado", label: "Finalizado" },
];

/** Igual que el de las imágenes: sin acentos, sin espacios, sin símbolos. */
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const EMPTY: Localized<string> = { es: "", en: "" };

export function AdminProjectNew() {
  const navigate = useNavigate();
  const regions = useRegions();
  const projects = useAllProjects();
  const create = useCreateProject();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [tagline, setTagline] = useState(EMPTY);
  const [description, setDescription] = useState(EMPTY);
  const [location, setLocation] = useState(EMPTY);
  const [regionSlug, setRegionSlug] = useState("");
  const [status, setStatus] = useState("en-obra");
  const [error, setError] = useState<string | null>(null);

  // El slug se deriva del nombre hasta que alguien lo edita a mano. Después
  // deja de seguirlo, para no pisarle la decisión.
  const effectiveSlug = slugTouched ? slug : slugify(name);

  // `nuevo` es la ruta del alta: un proyecto con ese slug quedaría inaccesible
  // desde el panel, porque la ruta estática le gana a la dinámica.
  const RESERVED = ["nuevo"];
  const taken =
    projects.some((p) => p.slug === effectiveSlug) ||
    RESERVED.includes(effectiveSlug);
  const slugValid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(effectiveSlug);

  const canSubmit =
    name.trim() !== "" &&
    effectiveSlug !== "" &&
    slugValid &&
    !taken &&
    tagline.es.trim() !== "" &&
    tagline.en.trim() !== "" &&
    description.es.trim() !== "" &&
    description.en.trim() !== "" &&
    location.es.trim() !== "" &&
    location.en.trim() !== "" &&
    regionSlug !== "" &&
    !create.isPending;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const created = await create.mutateAsync({
        slug: effectiveSlug,
        name: name.trim(),
        tagline,
        description,
        location,
        region_slug: regionSlug,
        status,
      });
      // Al editor: es donde se sube la imagen y se completa el resto.
      navigate(`/admin/proyectos/${created}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el proyecto.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl pb-16">
      <div className="mb-8">
        <Link
          to="/admin/proyectos"
          className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-primary transition-colors"
        >
          ← Proyectos
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Nuevo proyecto
        </h1>
        <p className="mt-2 max-w-xl opacity-60 leading-relaxed">
          Sólo lo indispensable para empezar. Se crea <b>en borrador</b>: no se
          ve en la landing hasta que lo publiques. Las imágenes y el resto de los
          datos se cargan en el paso siguiente.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-error/50 bg-error/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <TextField
        label="Nombre"
        value={name}
        onChange={(v) => setName(v)}
        placeholder="Mercatus"
      />

      <TextField
        label="URL"
        hint={`Así va a quedar: /proyectos/${effectiveSlug || "…"}. Se arma sola con el nombre; cambiala sólo si hace falta, porque después no se puede modificar sin romper los links compartidos.`}
        value={effectiveSlug}
        onChange={(v) => {
          setSlugTouched(true);
          setSlug(slugify(v));
        }}
      />
      {effectiveSlug !== "" && !slugValid && (
        <p className="-mt-4 mb-6 text-xs text-warning">
          La URL sólo admite minúsculas, números y guiones.
        </p>
      )}
      {taken && (
        <p className="-mt-4 mb-6 text-xs text-error">
          Ya hay un proyecto con esta URL.
        </p>
      )}

      <LocalizedField
        label="Tagline"
        hint="El titular del card y de la página de detalle."
        value={tagline}
        onChange={setTagline}
      />
      <LocalizedField
        label="Descripción"
        multiline
        value={description}
        onChange={setDescription}
      />
      <LocalizedField
        label="Ubicación"
        hint="Como se muestra al público, ej. «Cafayate, Salta»."
        value={location}
        onChange={setLocation}
      />

      <SelectField
        label="Región"
        hint="Define en qué mapa aparece y en qué conteo suma."
        value={regionSlug}
        onChange={setRegionSlug}
        options={[
          { value: "", label: "Elegí una región…" },
          ...regions.map((r) => ({ value: r.slug, label: r.name })),
        ]}
      />
      <SelectField
        label="Estado"
        value={status}
        onChange={setStatus}
        options={STATUS_OPTIONS}
      />

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn btn-primary rounded-full px-8 disabled:opacity-40"
        >
          {create.isPending ? "Creando…" : "Crear y continuar"}
        </button>
        <Link
          to="/admin/proyectos"
          className="btn btn-ghost btn-sm rounded-full border border-base-content/20"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
