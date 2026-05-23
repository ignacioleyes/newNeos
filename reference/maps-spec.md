# Mapas de regiones — guía de exportación

Las cards de la sección "Dónde construimos" usan **mapas estáticos estilizados** como background, con dots magenta posicionados a partir de coordenadas reales (lat/lng).

El código ya está listo — solo hay que dropear 3 PNGs en `/public/maps/` con estos nombres exactos:

```
public/maps/
├── salta.png        ← provincia/área de Salta capital
├── cafayate.png     ← ciudad de Cafayate (zoom de calles)
└── argentina.png    ← país completo (para Vaca Muerta)
```

Mientras no estén los PNGs, las cards muestran un fallback con un degradé radial discreto + los dots flotando.

## Recomendación: Mapbox Static Images API

Es la forma más limpia de obtener mapas dark con el bbox exacto que necesita el código.

### Setup (5 min, gratis)

1. Crear cuenta en https://account.mapbox.com/signup/ (gratis, no pide tarjeta para uso bajo).
2. Copiar el **default public token** desde el dashboard.

### URLs para exportar (reemplazar `YOUR_TOKEN`)

Las URLs ya tienen el bbox exacto que matchea la data en `src/data/regions.ts`. Si cambian, hay que actualizar el `bbox` en el código.

**Salta** (Valle de Lerma — capital + San Lorenzo):

```
https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/[-65.7,-25.2,-64.8,-24.4]/600x800@2x?access_token=YOUR_TOKEN
```

**Cafayate** (zoom de la ciudad — plaza central + radio 1km):

```
https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/[-66.0,-26.1,-65.93,-26.05]/600x800@2x?access_token=YOUR_TOKEN
```

**Argentina** (continental completo para contexto Vaca Muerta):

```
https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/[-74,-55.5,-52,-21.5]/600x800@2x?access_token=YOUR_TOKEN
```

### Pasos

1. Pegar cada URL en el navegador (con tu token).
2. Click derecho sobre la imagen → **Guardar como** → `salta.png` / `cafayate.png` / `argentina.png`.
3. Moverlas a `public/maps/`.
4. ¡Listo! El dev server las toma automáticamente.

## Alternativas si Mapbox no te gusta

- **Google My Maps**: crear mapas custom, exportar como imagen (sin estilo dark nativo, hay que screenshotear con Chrome dev tools en dark mode).
- **Snazzy Maps**: dump de estilos JSON para Google Maps. Aplicás en Google Maps, screenshot, croppeás.
- **MapTiler / Stadia Maps**: alternativas a Mapbox con free tier similar.

## Cambiar el bbox de un mapa

Si cambiás el área que mostrás (zoom in/out, mover), tenés que actualizar **dos cosas en simultáneo**:

1. El bbox en la URL de exportación (los 4 números entre corchetes: `[west,south,east,north]`).
2. El `bbox` correspondiente en `src/data/regions.ts` para esa región.

Los dots se proyectan desde lat/lng usando el bbox del mapa, así que si no coinciden los dots quedan mal posicionados.

## Dots actuales

Definidos en `src/data/regions.ts` → array `dots` por región. Cada dot tiene:

```ts
{ lat, lng, label, status: "in-progress" | "finalized" }
```

- **in-progress** → dot magenta grande con anillo pulsante.
- **finalized** → dot blanco chiquito, sin animación (para proyectos entregados).

### Pendiente

Faltan los **2 proyectos entregados en Salta** que mencionaste — agregar a `regions.ts` en el array `dots` de `salta-capital` con `status: "finalized"`.
