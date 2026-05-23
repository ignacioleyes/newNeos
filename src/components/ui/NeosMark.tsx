interface NeosMarkProps {
  className?: string;
  title?: string;
}

/**
 * Isotipo NEOS — flor de 4 pétalos con orificio central.
 * Aproximación provisional hasta tener el SVG original.
 */
export function NeosMark({ className, title = "NEOS" }: NeosMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title}
      fill="currentColor"
    >
      <g>
        <ellipse cx="50" cy="50" rx="18" ry="46" />
        <ellipse cx="50" cy="50" rx="46" ry="18" />
      </g>
      <circle cx="50" cy="50" r="13" fill="var(--color-base-100)" />
    </svg>
  );
}
