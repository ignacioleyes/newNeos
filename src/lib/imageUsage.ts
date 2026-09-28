import type { ProjectSection } from "./sections";
import { SECTION_LABELS } from "./sectionDefaults";

/**
 * Dónde se está usando una imagen dentro de un proyecto.
 *
 * Al borrar desde la galería no se bloquea nada: se muestra la lista de usos y
 * se pide confirmación. Bloquear suena más prudente pero lleva a callejones sin
 * salida — para cambiar una foto de obra habría que editar tres secciones antes
 * de poder borrar la vieja.
 *
 * La búsqueda dentro de las secciones se hace sobre el JSON serializado, por la
 * misma razón que en el script de migración: las imágenes viven en cuatro
 * formas anidadas distintas, y enumerarlas deja afuera cualquier kind nuevo sin
 * que nadie lo note. Una URL completa es lo bastante distintiva como para que
 * no haya falsos positivos.
 */

export function findImageUsages(
  url: string,
  /** Valores actuales del formulario, no los guardados: el aviso tiene que
   * hablar de lo que la persona está viendo. */
  current: { heroImage?: string | null; logo?: string | null },
  sections: ProjectSection[]
): string[] {
  const usages: string[] = [];

  if (current.heroImage === url) usages.push("Imagen principal");
  if (current.logo === url) usages.push("Logo");

  for (const section of sections) {
    if (JSON.stringify(section.data ?? {}).includes(url)) {
      usages.push(`Sección «${SECTION_LABELS[section.kind] ?? section.kind}»`);
    }
  }

  return usages;
}
