import { useState } from "react";
import type { MapDot, RegionMapData } from "../../data/regions";

interface RegionMapProps {
  map: RegionMapData;
  dots: MapDot[];
  className?: string;
}

/**
 * Web Mercator projection of lat/lng to a fraction (0–1) inside a bbox.
 * Uses Mercator on the Y axis (accurate at country scale) and linear on X.
 */
function projectToFraction(
  lat: number,
  lng: number,
  bbox: RegionMapData["bbox"]
) {
  const x = (lng - bbox.west) / (bbox.east - bbox.west);
  const mercY = (l: number) =>
    Math.log(Math.tan(Math.PI / 4 + (l * Math.PI) / 360));
  const y =
    (mercY(bbox.north) - mercY(lat)) /
    (mercY(bbox.north) - mercY(bbox.south));
  return { x, y };
}

function Dot({
  dot,
  fraction,
}: {
  dot: MapDot;
  fraction: { x: number; y: number };
}) {
  const active = dot.status === "in-progress";
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 group/dot"
      style={{ left: `${fraction.x * 100}%`, top: `${fraction.y * 100}%` }}
      aria-label={dot.label}
    >
      {active && (
        <>
          <span className="absolute inset-0 -m-3 rounded-full bg-primary opacity-30 animate-ping" />
          <span className="absolute inset-0 -m-2 rounded-full bg-primary/25" />
        </>
      )}
      <span
        className={`relative block rounded-full ring-2 ring-base-100 shadow-lg ${
          active
            ? "bg-primary w-3.5 h-3.5"
            : "bg-white/80 w-2 h-2"
        }`}
      />
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap text-[10px] uppercase tracking-widest bg-base-100/90 backdrop-blur px-2 py-0.5 rounded opacity-0 group-hover/dot:opacity-100 transition-opacity">
        {dot.label}
      </span>
    </span>
  );
}

export function RegionMap({ map, dots, className }: RegionMapProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const showImage = map.image && !imgError;

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      {/* Real styled map image */}
      {showImage && (
        <img
          src={map.image as string}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Fallback while image is missing / not yet exported */}
      {(!showImage || !imgLoaded) && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(233,30,140,0.15),transparent_70%)] bg-base-200" />
      )}

      {/* Dots layer — projected from real lat/lng using bbox */}
      <div className="absolute inset-0">
        {dots.map((dot) => {
          const fraction = projectToFraction(dot.lat, dot.lng, map.bbox);
          // Skip dots that fall outside the bbox (clamp for safety)
          if (
            fraction.x < 0 ||
            fraction.x > 1 ||
            fraction.y < 0 ||
            fraction.y > 1
          )
            return null;
          return <Dot key={dot.label} dot={dot} fraction={fraction} />;
        })}
      </div>
    </div>
  );
}
