interface NeosMarkProps {
  className?: string;
  title?: string;
}

/**
 * Isotipo oficial de NEOS — flor de 4 pétalos con orificio central.
 * Renderiza el PNG ubicado en /public/neos-iso.png.
 */
export function NeosMark({ className, title = "NEOS" }: NeosMarkProps) {
  return (
    <img
      src="/neos-iso.png"
      alt={title}
      className={`${className ?? ""} object-contain [filter:brightness(0)_invert(1)]`.trim()}
      draggable={false}
    />
  );
}
