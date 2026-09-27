import { supabase } from "./supabase";

/**
 * Subida de imágenes al bucket `project-images`.
 *
 * EL REDIMENSIONADO NO ES UN EXTRA. El plan free de Supabase no incluye
 * transformación de imágenes, así que lo que se sube es exactamente lo que se
 * le sirve a cada visitante. Una foto de obra sacada con el celular pesa 4-6 MB
 * y hay 5 GB de tráfico por mes: sin achicarla, unas pocas cientas de visitas
 * agotan la cuota y mientras tanto la página carga lentísimo.
 *
 * Se achica en el navegador antes de subir. Una foto de 5 MB termina en ~250 KB,
 * que es el peso promedio de las que ya tenía el sitio.
 */

export const BUCKET = "project-images";

/** Lado mayor máximo. 1920 cubre pantallas grandes sin desperdiciar bytes. */
const MAX_EDGE = 1920;
const QUALITY = 0.82;

export interface StoredImage {
  /** Ruta dentro del bucket: <slug>/<archivo> */
  path: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

/**
 * Normaliza el nombre para que sea una ruta válida y estable.
 *
 * Supabase Storage rechaza varios caracteres, y los nombres que salen del
 * celular o de Windows vienen con espacios, acentos y paréntesis. Además se le
 * antepone un sufijo corto de tiempo: si alguien sube dos veces "obra.jpg" con
 * fotos distintas, sin eso la segunda pisaría a la primera — y la primera
 * podría estar en uso en alguna sección.
 */
function safeName(original: string): string {
  const dot = original.lastIndexOf(".");
  const base = (dot > 0 ? original.slice(0, dot) : original)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "imagen";
  const stamp = Date.now().toString(36).slice(-5);
  return `${base}-${stamp}.webp`;
}

/**
 * Achica la imagen manteniendo proporción y la convierte a WebP.
 *
 * WebP porque pesa bastante menos que JPEG a calidad equivalente y lo soportan
 * todos los navegadores relevantes desde hace años.
 */
async function resize(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen en este navegador.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/webp", QUALITY)
  );
  if (!blob) throw new Error("No se pudo comprimir la imagen.");
  return blob;
}

export interface UploadResult {
  image: StoredImage;
  /** Para poder mostrar cuánto se ahorró. */
  originalSize: number;
}

export async function uploadProjectImage(
  slug: string,
  file: File
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Ese archivo no es una imagen.");
  }

  const blob = await resize(file);
  const path = `${slug}/${safeName(file.name)}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/webp", upsert: false });

  if (error) throw new Error(`No se pudo subir: ${error.message}`);

  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  return {
    originalSize: file.size,
    image: {
      path,
      name: path.split("/").pop() ?? path,
      url,
      size: blob.size,
      createdAt: new Date().toISOString(),
    },
  };
}

/** Las imágenes de un proyecto, que son literalmente el contenido de su carpeta. */
export async function listProjectImages(slug: string): Promise<StoredImage[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(slug, { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (error) throw new Error(`No se pudieron listar las imágenes: ${error.message}`);

  return (data ?? [])
    // `list` devuelve también un placeholder sin metadata para carpetas vacías.
    .filter((o) => o.id !== null)
    .map((o) => {
      const path = `${slug}/${o.name}`;
      return {
        path,
        name: o.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
        size: (o.metadata?.size as number | undefined) ?? 0,
        createdAt: o.created_at ?? "",
      };
    });
}

export async function deleteProjectImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`No se pudo borrar: ${error.message}`);
}
