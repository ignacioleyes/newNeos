interface TopoPatternProps {
  className?: string;
  /** Opacidad global del patrón (0–1). */
  opacity?: number;
}

/**
 * Patrón topográfico decorativo. Líneas de nivel orgánicas en color primario.
 * Pensado para usarse como background absoluto en secciones.
 */
export function TopoPattern({ className = "", opacity = 0.35 }: TopoPatternProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`.trim()}
      viewBox="0 0 1200 800"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
      aria-hidden="true"
    >
      <g transform="translate(700 400)">
        <ellipse rx="520" ry="320" />
        <ellipse rx="440" ry="270" />
        <ellipse rx="360" ry="220" />
        <ellipse rx="280" ry="170" />
        <ellipse rx="200" ry="120" />
        <ellipse rx="120" ry="70" />
        <ellipse rx="50" ry="30" />
      </g>
      <g transform="translate(150 200) rotate(-12)">
        <ellipse rx="280" ry="180" />
        <ellipse rx="220" ry="140" />
        <ellipse rx="160" ry="100" />
        <ellipse rx="100" ry="60" />
        <ellipse rx="50" ry="30" />
      </g>
      <g transform="translate(300 700) rotate(8)">
        <ellipse rx="200" ry="120" />
        <ellipse rx="140" ry="80" />
        <ellipse rx="80" ry="45" />
      </g>
    </svg>
  );
}
