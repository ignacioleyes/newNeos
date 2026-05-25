interface IconProps {
  className?: string;
}

const baseProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Piscinas({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M14 12v22M22 12v22M14 18h8M14 24h8" />
      <path d="M6 38c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0 4-2 6 0 4 2 6 0" />
      <path d="M6 32c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4-2 6 0 4-2 6 0 4 2 6 0" />
    </svg>
  );
}

function Solarium({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="24" cy="24" r="6" />
      <path d="M24 8v4M24 36v4M8 24h4M36 24h4M12.5 12.5l2.8 2.8M32.7 32.7l2.8 2.8M12.5 35.5l2.8-2.8M32.7 15.3l2.8-2.8" />
    </svg>
  );
}

function Spa({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M24 8c-3 4-3 8 0 12 3-4 3-8 0-12z" />
      <path d="M16 16c-1 5 1 9 8 12-1-5-3-9-8-12z" />
      <path d="M32 16c1 5-1 9-8 12 1-5 3-9 8-12z" />
      <path d="M14 36h20" />
      <path d="M12 40h24" />
    </svg>
  );
}

function Bar({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M10 10h28L24 28 10 10z" />
      <path d="M24 28v10" />
      <path d="M18 40h12" />
      <circle cx="30" cy="14" r="1.2" fill="currentColor" />
    </svg>
  );
}

function KidsZone({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 38V18l8-6 8 6v20" />
      <path d="M12 22h16" />
      <path d="M18 38v-8h4v8" />
      <path d="M28 18l12 6v14" />
      <path d="M34 38v-8" />
    </svg>
  );
}

function KidsZoneCubierto({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 22 24 8l18 14" />
      <path d="M10 22v16h28V22" />
      <circle cx="24" cy="28" r="3" />
      <path d="M20 38v-4h8v4" />
    </svg>
  );
}

function CineAireLibre({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="6" y="10" width="36" height="22" rx="2" />
      <path d="M20 16l10 5-10 5V16z" fill="currentColor" stroke="none" />
      <path d="M14 38h20" />
      <path d="M18 38l-2 4M30 38l2 4" />
    </svg>
  );
}

function Sum({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 22h36" />
      <path d="M10 22v14M38 22v14" />
      <path d="M14 22v-4a4 4 0 014-4h12a4 4 0 014 4v4" />
      <path d="M18 28v8M30 28v8" />
    </svg>
  );
}

function Gimnasio({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 18v12M10 14v20M38 14v20M42 18v12" />
      <path d="M10 24h28" />
    </svg>
  );
}

function Yoga({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="24" cy="12" r="3" />
      <path d="M24 17v8" />
      <path d="M24 25c-6 0-12 4-14 13h28c-2-9-8-13-14-13z" />
      <path d="M14 38l10-5 10 5" />
    </svg>
  );
}

function MotoTouring({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="32" r="6" />
      <circle cx="36" cy="32" r="6" />
      <path d="M18 32l6-12h8" />
      <path d="M24 20l-4-6h-4" />
      <path d="M32 20l4 12" />
    </svg>
  );
}

function Fogoneros({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M24 8c2 4 6 6 6 12 0 4-3 7-6 7s-6-3-6-7c0-3 2-5 3-8 1 3 3 4 3 6" />
      <path d="M16 36h16" />
      <path d="M12 40h24" />
    </svg>
  );
}

function PiscinaClimatizada({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      {/* termómetro */}
      <path d="M16 8a3 3 0 016 0v18a5 5 0 11-6 0V8z" />
      <circle cx="19" cy="31" r="2.5" fill="currentColor" stroke="none" />
      <path d="M19 14v12" />
      {/* olas de agua */}
      <path d="M28 24c2-2 4-2 6 0s4 2 6 0" />
      <path d="M28 30c2-2 4-2 6 0s4 2 6 0" />
      <path d="M28 36c2-2 4-2 6 0s4 2 6 0" />
    </svg>
  );
}

const ICON_MAP: Record<string, (props: IconProps) => React.JSX.Element> = {
  "2 piscinas": Piscinas,
  "piscinas": Piscinas,
  "solarium": Solarium,
  "spa": Spa,
  "bar": Bar,
  "kids zone": KidsZone,
  "kids zone cubierto": KidsZoneCubierto,
  "cine aire libre": CineAireLibre,
  "sum": Sum,
  "gimnasio": Gimnasio,
  "yoga": Yoga,
  "moto touring area": MotoTouring,
  "fogoneros": Fogoneros,
  "piscina int. climatizada": PiscinaClimatizada,
  "piscina climatizada": PiscinaClimatizada,
};

interface AmenityIconProps {
  name: string;
  className?: string;
}

export function AmenityIcon({ name, className }: AmenityIconProps) {
  const key = name.toLowerCase().trim();
  const Icon = ICON_MAP[key];
  if (!Icon) {
    return (
      <svg {...baseProps} className={className}>
        <circle cx="24" cy="24" r="14" />
      </svg>
    );
  }
  return <Icon className={className} />;
}
