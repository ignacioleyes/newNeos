import type { ReactNode } from "react";

interface NeoMessageProps {
  from: "neo" | "user";
  children: ReactNode;
}

/**
 * Burbuja de mensaje. Estilo:
 *   - neo  → alineada a la izquierda, blanca con borde sutil, esquina top-left chica
 *   - user → alineada a la derecha, magenta con texto blanco, esquina top-right chica
 *
 * Dumb component — el texto y la resolución desde stepId la hace el padre.
 * Acepta `children` para permitir formato rico si después hace falta.
 */
export function NeoMessage({ from, children }: NeoMessageProps) {
  const isNeo = from === "neo";

  return (
    <div className={`flex ${isNeo ? "justify-start" : "justify-end"}`}>
      <div
        className={`
          max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm
          ${
            isNeo
              ? "bg-base-100 text-base-content border border-base-300/60 rounded-2xl rounded-tl-md"
              : "bg-primary text-white rounded-2xl rounded-tr-md"
          }
        `}
      >
        {children}
      </div>
    </div>
  );
}
