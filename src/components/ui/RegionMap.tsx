import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import type { MapDot, RegionMapData } from "../../data/regions";
import { projects, type Project } from "../../data/projects";
import { useTr } from "../../i18n/LanguageContext";

interface RegionMapProps {
  map: RegionMapData;
  dots: MapDot[];
  className?: string;
}

// Marker activo — magenta con pulso (proyectos en obra)
const ACTIVE_ICON = L.divIcon({
  className: "neos-marker",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  html: `
    <div style="position:relative;width:30px;height:30px;">
      <span style="position:absolute;inset:0;border-radius:50%;background:#e91e8c;opacity:0.3;animation:neos-pulse 2s ease-out infinite;"></span>
      <span style="position:absolute;inset:3px;border-radius:50%;background:#e91e8c;opacity:0.2;"></span>
      <span style="position:absolute;inset:8px;border-radius:50%;background:#e91e8c;border:2px solid #0a0a0a;box-shadow:0 2px 6px rgba(0,0,0,0.5);"></span>
    </div>
  `,
});

// Marker finalizado — blanco chiquito sin pulso (proyectos entregados)
const FINALIZED_ICON = L.divIcon({
  className: "neos-marker",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  html: `<div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.85);border:2px solid #0a0a0a;box-shadow:0 2px 6px rgba(0,0,0,0.5);"></div>`,
});

const CARTO_DARK_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";

const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function findProject(slug: string | undefined): Project | null {
  if (!slug) return null;
  return projects.find((p) => p.slug === slug) ?? null;
}

/**
 * Mapa interactivo (decorativo) de una región con dots de proyectos.
 * Usa Leaflet + tiles CartoDB Dark Matter (free, sin API key).
 *
 * En hover de un dot que tenga `projectSlug`, aparece un mini-card con
 * el hero del proyecto, nombre y tagline. Si no, tooltip simple con label.
 */
export function RegionMap({ map, dots, className }: RegionMapProps) {
  const tr = useTr();

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      <MapContainer
        center={map.center}
        zoom={map.zoom}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        boxZoom={false}
        attributionControl={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={CARTO_DARK_URL}
          attribution={CARTO_ATTRIBUTION}
          subdomains="abcd"
          maxZoom={20}
        />
        {dots.map((dot) => {
          const project = findProject(dot.projectSlug);
          const icon =
            dot.status === "in-progress" ? ACTIVE_ICON : FINALIZED_ICON;

          return (
            <Marker key={dot.label} position={[dot.lat, dot.lng]} icon={icon}>
              {project ? (
                <Tooltip
                  className="neos-project-tooltip"
                  direction="top"
                  offset={[0, -12]}
                >
                  <div className="w-[150px]">
                    <div className="aspect-[16/10] overflow-hidden rounded-md bg-base-300">
                      <img
                        src={project.heroImage}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-white leading-tight">
                      {project.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/60 leading-snug">
                      {tr(project.tagline)}
                    </p>
                  </div>
                </Tooltip>
              ) : (
                <Tooltip direction="top" offset={[0, -10]}>
                  {dot.label}
                </Tooltip>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
