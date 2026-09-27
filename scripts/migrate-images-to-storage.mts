/**
 * Sube las imágenes de `public/projects/` a Supabase Storage y reescribe las
 * referencias en la base.
 *
 *   yarn migrate:images --dry-run   # muestra qué haría, sin tocar nada
 *   yarn migrate:images             # lo hace
 *
 * POR QUÉ NECESITA LA SERVICE ROLE KEY
 * Subir al bucket exige ser un empleado activo (así lo pide la policy), y un
 * script no puede loguearse como una persona. La service role key saltea la RLS
 * y es la forma prevista de hacer tareas de mantenimiento como esta.
 *
 * Va en `.env.local` (gitignoreado) como SUPABASE_SERVICE_ROLE_KEY, SIN el
 * prefijo `VITE_`. Eso no es un detalle estético: Vite sólo expone al bundle
 * del navegador las variables que empiezan con `VITE_`. Con ese nombre, la key
 * es inalcanzable desde el front aunque alguien la importe por error.
 *
 * ES IDEMPOTENTE: al correrlo de nuevo no quedan rutas `/projects/` que
 * reescribir, así que no hace nada. Se puede repetir sin miedo.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = resolve(ROOT, "public/projects");
const BUCKET = "project-images";
const DRY_RUN = process.argv.includes("--dry-run");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

function readEnvLocal(): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    const raw = readFileSync(resolve(ROOT, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* sin .env.local, se usa el entorno */
  }
  return env;
}

const env = { ...readEnvLocal(), ...process.env };
const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error("Falta VITE_SUPABASE_URL.");
  process.exit(1);
}
// El dry run no escribe nada, así que le alcanza la key pública: se puede
// previsualizar la migración sin tener que pegar ninguna credencial secreta.
// Ojo que con la pública la RLS filtra, así que el preview sólo ve los
// proyectos publicados.
const key = serviceKey ?? (DRY_RUN ? env.VITE_SUPABASE_ANON_KEY : undefined);

if (!key) {
  console.error(
    "Falta SUPABASE_SERVICE_ROLE_KEY.\n\n" +
      "Se saca de: Dashboard → Settings → API Keys → service_role (o secret).\n" +
      "Va en .env.local (gitignoreado), SIN el prefijo VITE_:\n\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=sb_secret_...\n\n" +
      "Sin el prefijo VITE_, Vite nunca la incluye en el bundle del navegador.\n" +
      "Para sólo ver qué haría, corré con --dry-run: eso no la necesita."
  );
  process.exit(1);
}

if (DRY_RUN && !serviceKey) {
  console.log("(dry run con la key pública: sólo se ven proyectos publicados)\n");
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// -----------------------------------------------------------------------------
// 1. Juntar los archivos locales
// -----------------------------------------------------------------------------
interface LocalImage {
  /** Cómo la referencia hoy la base: /projects/<slug>/<archivo> */
  oldPath: string;
  /** Dónde va en el bucket: <slug>/<archivo> */
  storagePath: string;
  absolute: string;
  size: number;
  mime: string;
}

function collect(): LocalImage[] {
  const out: LocalImage[] = [];
  let slugs: string[];
  try {
    slugs = readdirSync(SOURCE_DIR).filter((d) =>
      statSync(join(SOURCE_DIR, d)).isDirectory()
    );
  } catch {
    console.error(`No existe ${SOURCE_DIR}`);
    process.exit(1);
  }

  for (const slug of slugs) {
    for (const file of readdirSync(join(SOURCE_DIR, slug))) {
      const abs = join(SOURCE_DIR, slug, file);
      if (!statSync(abs).isFile()) continue;
      const mime = MIME[extname(file).toLowerCase()];
      if (!mime) continue;
      out.push({
        oldPath: `/projects/${slug}/${file}`,
        storagePath: `${slug}/${file}`,
        absolute: abs,
        size: statSync(abs).size,
        mime,
      });
    }
  }
  return out.sort((a, b) => a.oldPath.localeCompare(b.oldPath));
}

const images = collect();
console.log(`Encontradas ${images.length} imágenes en public/projects/\n`);

// -----------------------------------------------------------------------------
// 2. Subir
// -----------------------------------------------------------------------------
const urlByOldPath = new Map<string, string>();

for (const img of images) {
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(img.storagePath)
    .data.publicUrl;
  urlByOldPath.set(img.oldPath, publicUrl);

  const kb = (img.size / 1024).toFixed(0);
  if (DRY_RUN) {
    console.log(`  [dry] ${img.oldPath}  (${kb} KB)  ->  ${img.storagePath}`);
    continue;
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(img.storagePath, readFileSync(img.absolute), {
      contentType: img.mime,
      upsert: true,
    });

  if (error) {
    console.error(`  ERROR subiendo ${img.oldPath}: ${error.message}`);
    process.exit(1);
  }
  console.log(`  subida ${img.storagePath}  (${kb} KB)`);
}

// -----------------------------------------------------------------------------
// 3. Reescribir las referencias
// -----------------------------------------------------------------------------
/**
 * El reemplazo se hace sobre el JSON serializado y no campo por campo.
 *
 * Las imágenes viven en lugares muy distintos: dos columnas de `projects` y
 * cuatro formas anidadas distintas dentro de `project_sections.data`
 * (hero.images[].src, what_is.image, masterplan.image, gallery.images[].src).
 * Enumerar cada shape es frágil: si mañana se agrega un kind de sección con
 * imágenes, hay que acordarse de tocar esto. Reemplazar sobre el texto del
 * JSON los alcanza a todos, y las rutas `/projects/...` son lo bastante
 * distintivas como para que no haya falsos positivos.
 */
function rewrite(text: string): { out: string; hits: number } {
  let out = text;
  let hits = 0;
  for (const [oldPath, newUrl] of urlByOldPath) {
    const parts = out.split(oldPath);
    if (parts.length > 1) {
      hits += parts.length - 1;
      out = parts.join(newUrl);
    }
  }
  return { out, hits };
}

console.log("\nReescribiendo referencias...\n");

// --- projects.hero_image / logo ---
const { data: projectRows, error: pErr } = await supabase
  .from("projects")
  .select("slug, hero_image, logo");
if (pErr) {
  console.error("Error leyendo projects:", pErr.message);
  process.exit(1);
}

for (const row of projectRows ?? []) {
  const patch: Record<string, string> = {};
  for (const field of ["hero_image", "logo"] as const) {
    const current = row[field] as string | null;
    if (!current) continue;
    const { out, hits } = rewrite(current);
    if (hits > 0) patch[field] = out;
  }
  if (Object.keys(patch).length === 0) continue;

  console.log(`  projects/${row.slug}: ${Object.keys(patch).join(", ")}`);
  if (DRY_RUN) continue;

  const { error } = await supabase.from("projects").update(patch).eq("slug", row.slug);
  if (error) {
    console.error(`  ERROR actualizando ${row.slug}: ${error.message}`);
    process.exit(1);
  }
}

// --- project_sections.data ---
const { data: sectionRows, error: sErr } = await supabase
  .from("project_sections")
  .select("id, kind, data, projects!inner(slug)");
if (sErr) {
  console.error("Error leyendo project_sections:", sErr.message);
  process.exit(1);
}

for (const row of sectionRows ?? []) {
  const { out, hits } = rewrite(JSON.stringify(row.data));
  if (hits === 0) continue;

  const slug = (row.projects as unknown as { slug: string }).slug;
  console.log(`  sections/${slug}/${row.kind}: ${hits} referencia(s)`);
  if (DRY_RUN) continue;

  const { error } = await supabase
    .from("project_sections")
    .update({ data: JSON.parse(out) })
    .eq("id", row.id);
  if (error) {
    console.error(`  ERROR actualizando sección ${row.id}: ${error.message}`);
    process.exit(1);
  }
}

console.log(
  DRY_RUN
    ? "\nDry run: no se tocó nada. Corré sin --dry-run para aplicarlo."
    : "\nListo. Ahora corré `yarn snapshot` para actualizar el snapshot local."
);
