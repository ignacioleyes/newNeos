import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useContentQuery, useProject, useRegions } from "../../hooks/useContent";
import { useUpdateProject, type ProjectPatch } from "../../hooks/useProjectMutations";
import {
  LocalizedField,
  LocalizedListField,
  SelectField,
  TextField,
} from "../../components/admin/Field";
import { PROJECT_GRADIENTS } from "../../lib/presentation";
import type { Localized } from "../../i18n/types";
import type { Project } from "../../data/projects";

const STATUS_OPTIONS = [
  { value: "anteproyecto", label: "Anteproyecto" },
  { value: "en-obra", label: "En obra" },
  { value: "lanzamiento", label: "Lanzamiento" },
  { value: "finalizado", label: "Finalizado" },
];

const GRADIENT_OPTIONS = Object.keys(PROJECT_GRADIENTS).map((k) => ({
  value: k,
  label: k,
}));

/** `null` para los opcionales vacíos: la base distingue "sin dato" de "". */
function orNull(v: string): string | null {
  const t = v.trim();
  return t === "" ? null : t;
}

function localizedOrNull(v: Localized<string>): Localized<string> | null {
  return v.es.trim() === "" && v.en.trim() === "" ? null : v;
}

function toForm(p: Project) {
  return {
    name: p.name,
    hashtag: p.hashtag ?? "",
    tagline: p.tagline,
    description: p.description,
    about: p.about ?? { es: "", en: "" },
    location: p.location,
    regionSlug: p.regionSlug,
    status: p.status as string,
    units: p.units ?? { es: "", en: "" },
    tipologias: p.tipologias ?? { es: "", en: "" },
    investment: p.investment ?? { es: "", en: "" },
    highlights: p.highlights,
    heroImage: p.heroImage,
    logo: p.logo ?? "",
    brochureUrl: p.brochureUrl ?? "",
    progressUrl: p.progressUrl ?? "",
    videoEmbed: p.videoEmbed ?? "",
    mapsUrl: p.mapsUrl ?? "",
    gradientKey: p.gradientKey,
    lat: p.lat != null ? String(p.lat) : "",
    lng: p.lng != null ? String(p.lng) : "",
  };
}

type FormState = ReturnType<typeof toForm>;

export function AdminProjectEdit() {
  const { slug } = useParams<{ slug: string }>();
  const { isPending } = useContentQuery();
  const project = useProject(slug);
  const regions = useRegions();
  const update = useUpdateProject();

  const [form, setForm] = useState<FormState | null>(null);
  const [seededSlug, setSeededSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // El formulario se siembra una sola vez por proyecto, ajustando el estado
  // durante el render y no desde un efecto. Con un efecto React pinta una vez
  // con el formulario vacío y recién después lo llena; y además cada
  // invalidación de la query mientras alguien escribe le pisaría lo tipeado.
  if (project && seededSlug !== project.slug) {
    setSeededSlug(project.slug);
    setForm(toForm(project));
  }

  const dirty = useMemo(() => {
    if (!project || !form) return false;
    return JSON.stringify(form) !== JSON.stringify(toForm(project));
  }, [project, form]);

  // Avisa antes de cerrar la pestaña con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  if (!project) {
    if (isPending) return null;
    return <Navigate to="/admin/proyectos" replace />;
  }
  if (!form) return null;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setSaved(false);
    setForm((f) => (f ? { ...f, [key]: value } : f));
  };

  const latNum = form.lat.trim() === "" ? null : Number(form.lat);
  const lngNum = form.lng.trim() === "" ? null : Number(form.lng);
  const coordsInvalid =
    (latNum !== null && Number.isNaN(latNum)) ||
    (lngNum !== null && Number.isNaN(lngNum)) ||
    (latNum === null) !== (lngNum === null);

  const required =
    form.name.trim() &&
    form.tagline.es.trim() &&
    form.tagline.en.trim() &&
    form.description.es.trim() &&
    form.description.en.trim() &&
    form.location.es.trim() &&
    form.location.en.trim() &&
    form.heroImage.trim();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form || !slug) return;
    setError(null);

    const patch: ProjectPatch = {
      name: form.name.trim(),
      hashtag: orNull(form.hashtag),
      tagline: form.tagline,
      description: form.description,
      about: localizedOrNull(form.about),
      location: form.location,
      region_slug: form.regionSlug,
      status: form.status,
      units: localizedOrNull(form.units),
      tipologias: localizedOrNull(form.tipologias),
      investment: localizedOrNull(form.investment),
      // Las líneas vacías se descartan recién acá, no mientras se escribe.
      highlights: {
        es: form.highlights.es.map((s) => s.trim()).filter(Boolean),
        en: form.highlights.en.map((s) => s.trim()).filter(Boolean),
      },
      hero_image: form.heroImage.trim(),
      logo: orNull(form.logo),
      brochure_url: orNull(form.brochureUrl),
      progress_url: orNull(form.progressUrl),
      video_embed: orNull(form.videoEmbed),
      maps_url: orNull(form.mapsUrl),
      gradient_key: form.gradientKey,
      lat: latNum,
      lng: lngNum,
    };

    try {
      await update.mutateAsync({ slug, patch });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal. Probá de nuevo.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl pb-24">
      <div className="mb-8">
        <Link
          to="/admin/proyectos"
          className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-primary transition-colors"
        >
          ← Proyectos
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          {project.name}
        </h1>
        <p className="mt-1 text-sm opacity-50">
          /proyectos/{project.slug}
          {!project.isPublished && " · borrador"}
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-error/50 bg-error/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Section title="Identidad">
        <TextField label="Nombre" value={form.name} onChange={(v) => set("name", v)} />
        <TextField
          label="Hashtag"
          hint="Opcional. Aparece en el card y arriba del pull quote. Si no tiene, ahí se muestra la ubicación."
          placeholder="#stayincafayate"
          value={form.hashtag}
          onChange={(v) => set("hashtag", v)}
        />
        <TextField
          label="Slug"
          hint="No se puede editar acá: cambiarlo rompería los links ya compartidos y las URLs indexadas por Google. Si hace falta cambiarlo, avisale a quien mantiene el sitio."
          value={project.slug}
          onChange={() => {}}
          disabled
        />
      </Section>

      <Section title="Textos">
        <LocalizedField
          label="Tagline"
          hint="El titular grande de la página de detalle y el texto del card."
          value={form.tagline}
          onChange={(v) => set("tagline", v)}
        />
        <LocalizedField
          label="Descripción"
          hint="El párrafo del card destacado y del hero."
          multiline
          value={form.description}
          onChange={(v) => set("description", v)}
        />
        <LocalizedField
          label="Sobre el proyecto"
          hint="Opcional. Texto largo institucional."
          multiline
          rows={5}
          value={form.about}
          onChange={(v) => set("about", v)}
        />
        <LocalizedListField
          label="Highlights"
          hint="Uno por línea. El card muestra los primeros 2 o 3 según su tamaño."
          value={form.highlights}
          onChange={(v) => set("highlights", v)}
        />
      </Section>

      <Section title="Ubicación y estado">
        <LocalizedField
          label="Ubicación"
          value={form.location}
          onChange={(v) => set("location", v)}
        />
        <SelectField
          label="Región"
          hint="Define en qué mapa aparece el proyecto y en qué conteo suma."
          value={form.regionSlug}
          onChange={(v) => set("regionSlug", v)}
          options={regions.map((r) => ({ value: r.slug, label: r.name }))}
        />
        <SelectField
          label="Estado"
          value={form.status}
          onChange={(v) => set("status", v)}
          options={STATUS_OPTIONS}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Latitud"
            placeholder="-26.0744"
            value={form.lat}
            onChange={(v) => set("lat", v)}
          />
          <TextField
            label="Longitud"
            placeholder="-65.9741"
            value={form.lng}
            onChange={(v) => set("lng", v)}
          />
        </div>
        {coordsInvalid && (
          <p className="-mt-3 mb-6 text-xs text-warning/80">
            Las coordenadas tienen que ser dos números, o las dos vacías.
          </p>
        )}
        <p className="-mt-2 mb-6 text-xs opacity-50 leading-relaxed">
          Se sacan de Google Maps con click derecho → copiar coordenadas. Con 4
          decimales el pin cae en la manzana; con 6, en la puerta del edificio.
        </p>
      </Section>

      <Section title="Ficha">
        <LocalizedField label="Unidades" value={form.units} onChange={(v) => set("units", v)} />
        <LocalizedField
          label="Tipología"
          value={form.tipologias}
          onChange={(v) => set("tipologias", v)}
        />
        <LocalizedField
          label="Inversión"
          value={form.investment}
          onChange={(v) => set("investment", v)}
        />
      </Section>

      <Section title="Imágenes y links">
        <TextField
          label="Imagen principal"
          hint="Ruta dentro de public/, ej. /projects/chaquies/hero.jpg"
          value={form.heroImage}
          onChange={(v) => set("heroImage", v)}
        />
        {form.heroImage.trim() !== "" && (
          <img
            src={form.heroImage}
            alt=""
            className="-mt-3 mb-6 h-32 w-full max-w-xs rounded-xl object-cover border border-base-300/60"
          />
        )}
        <TextField label="Logo" value={form.logo} onChange={(v) => set("logo", v)} />
        <TextField label="Brochure" value={form.brochureUrl} onChange={(v) => set("brochureUrl", v)} />
        <TextField label="Avance de obra" value={form.progressUrl} onChange={(v) => set("progressUrl", v)} />
        <TextField label="Video embebido" value={form.videoEmbed} onChange={(v) => set("videoEmbed", v)} />
        <TextField label="Google Maps" value={form.mapsUrl} onChange={(v) => set("mapsUrl", v)} />
      </Section>

      <Section title="Color">
        <SelectField
          label="Gradiente"
          hint="Es una lista cerrada: Tailwind sólo incluye en el CSS las clases que encuentra escritas en el código, así que un color inventado acá no existiría."
          value={form.gradientKey}
          onChange={(v) => set("gradientKey", v)}
          options={GRADIENT_OPTIONS}
        />
        <div
          className={`-mt-3 h-16 rounded-xl bg-gradient-to-br ${
            PROJECT_GRADIENTS[form.gradientKey as keyof typeof PROJECT_GRADIENTS] ?? ""
          }`}
        />
      </Section>

      {/* Barra fija: en un formulario largo, un botón al final obliga a
          scrollear hasta abajo para guardar un cambio hecho arriba. */}
      <div className="fixed inset-x-0 bottom-0 border-t border-base-300/60 bg-base-200/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-end gap-4 px-6 py-4 lg:px-10">
          {saved && !dirty && (
            <span className="text-sm text-success">Guardado.</span>
          )}
          {dirty && <span className="text-sm opacity-60">Cambios sin guardar</span>}
          <Link
            to={`/proyectos/${project.slug}`}
            target="_blank"
            className="btn btn-ghost btn-sm rounded-full border border-base-content/20 hover:border-primary hover:text-primary transition-colors"
          >
            Ver ↗
          </Link>
          <button
            type="submit"
            disabled={!dirty || !required || coordsInvalid || update.isPending}
            className="btn btn-primary rounded-full px-8 disabled:opacity-40"
          >
            {update.isPending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-5 border-b border-base-300/60 pb-2 font-display text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}
