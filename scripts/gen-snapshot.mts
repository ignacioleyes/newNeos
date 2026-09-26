/**
 * Regenera `src/data/content.snapshot.ts` desde Supabase.
 *
 *   yarn snapshot
 *
 * ¿Por qué existe? La landing usa el snapshot como `placeholderData`: pinta
 * instantánea con el último contenido conocido y se actualiza sola cuando
 * responde la base. Sin eso, la home arrancaría con un spinner — inaceptable en
 * una pieza de conversión — y se caería del todo si Supabase está pausado.
 *
 * El costo es que el snapshot envejece: hay que correrlo antes de cada deploy.
 *
 * A propósito NO está enganchado al script `build`. Si lo estuviera, un build
 * fallaría cuando Supabase está pausado o sin red — justo el escenario del que
 * el snapshot nos protege. Mejor que el build siempre funcione con el último
 * snapshot commiteado y que refrescarlo sea un paso explícito.
 *
 * Usa la anon key a propósito: el snapshot tiene que contener exactamente lo
 * que ve el público, ni más ni menos. Si un proyecto está despublicado, la RLS
 * lo filtra y no entra acá.
 *
 * El mapeo NO se duplica: reusa mapProjects/mapRegions de src/lib/contentMapping,
 * las mismas que usa la app en runtime.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import {
  mapProjects,
  mapRegions,
  type ProjectRow,
  type RegionRow,
} from "../src/lib/contentMapping.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/content.snapshot.ts");

/** Lee .env.local sin dependencias. Formato KEY=value, ignora comentarios. */
function readEnvLocal(): Record<string, string> {
  const env: Record<string, string> = {};
  let raw: string;
  try {
    raw = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  } catch {
    return env;
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = { ...readEnvLocal(), ...process.env };
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY.\n" +
      "Se leen de .env.local o del entorno (para CI)."
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const [projectsRes, regionsRes] = await Promise.all([
  supabase.from("projects").select("*").order("display_order"),
  supabase.from("regions").select("*").order("display_order"),
]);

if (projectsRes.error) {
  console.error("Error trayendo projects:", projectsRes.error.message);
  process.exit(1);
}
if (regionsRes.error) {
  console.error("Error trayendo regions:", regionsRes.error.message);
  process.exit(1);
}

const regionRows = (regionsRes.data ?? []) as RegionRow[];
const projectRows = (projectsRes.data ?? []) as ProjectRow[];

// Una base vacía casi siempre significa credenciales de otro proyecto o una RLS
// mal puesta. Pisar el snapshot con [] dejaría la landing en blanco.
if (projectRows.length === 0) {
  console.error(
    "La base devolvió 0 proyectos publicados. No se regenera el snapshot:\n" +
      "pisarlo con una lista vacía dejaría la landing sin contenido.\n" +
      "Revisá que .env.local apunte al proyecto correcto y que haya proyectos publicados."
  );
  process.exit(1);
}

const projects = mapProjects(projectRows, regionRows);
const regions = mapRegions(regionRows, projects);

const banner = `// ARCHIVO GENERADO — no editar a mano.
// Se regenera con \`yarn snapshot\` desde Supabase.
// Ver scripts/gen-snapshot.mts y la nota en ./projects.ts
// Generado: ${new Date().toISOString()}
`;

const body = `${banner}
import type { Project } from "./projects";
import type { Region } from "./regions";

export const projectsSnapshot: Project[] = ${JSON.stringify(projects, null, 2)};

export const regionsSnapshot: Region[] = ${JSON.stringify(regions, null, 2)};
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, body, "utf8");

console.log(`snapshot regenerado: ${projects.length} proyectos, ${regions.length} regiones`);
console.log(`  destacado: ${projects.find((p) => p.isFeatured)?.slug ?? "(ninguno)"}`);
console.log(`  -> ${OUT}`);
