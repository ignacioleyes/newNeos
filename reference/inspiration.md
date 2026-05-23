# Inspiración / Dirección estética

> Documento de dirección para el rediseño de NEOS. Toma como referencia [conduflex.com.ar](https://conduflex.com.ar/), diseñada por la agencia **Disruptive®** (Buenos Aires). El espíritu a replicar: **corporate-minimal con jerarquía fuerte**, ordenado, profesional, sin perder personalidad — adaptado a la paleta y al ADN visual de NEOS.

## Espíritu general

- **Corporate-minimal con personalidad**: limpio, ordenado, profesional, pero no aséptico.
- **Tipografía como protagonista**: titulares grandes, contraste alto entre H1 y body.
- **Whitespace generoso**: aire entre secciones, nada apretado.
- **Grids ordenados** con variación entre 3-cols, split asimétrico y full-bleed.
- **Motion sutil pero presente** (más rico que conduflex, que es bastante quieto).
- **Identidad NEOS por encima de la referencia**: paleta magenta/negro, patrón topográfico, claim "Oportunidades que se concretan".

## Paleta

| Rol | Color | Uso |
|---|---|---|
| Fondo dominante | Negro `#0A0A0A` | Hero, secciones principales, footer |
| Acento primario | Magenta `#E91E8C` | CTAs, headings clave, isotipo, links activos |
| Surface secundaria | Gris claro `#D3D3D3` / `#EFEFEF` | Secciones tipo "Quiénes somos" para romper el negro |
| Texto sobre negro | Blanco `#FFFFFF` | Body sobre fondos oscuros |
| Texto sobre claro | Negro `#0A0A0A` | Body sobre fondos claros |
| Decorativo | Líneas topográficas magenta sobre negro | Backgrounds, separadores, hero secundarios |

## Tipografía (propuesta inicial — a validar)

- **Display / H1**: sans serif geométrica, peso medium/semibold, tracking tight, tamaños grandes (48-96px desktop). Ej. *Inter Tight*, *General Sans*, *Geist*, *Söhne*.
- **Body**: sans serif legible, regular (15-17px). Misma familia o pareja simple.
- **Posible toque editorial**: un serif para detalles puntuales (eyebrows, números grandes en métricas). Opcional, a definir.

## Patrones de layout a usar

| Patrón | Dónde aplicarlo |
|---|---|
| **Hero limpio**: claim grande + CTA único + media a la derecha o background | Home + cada página de proyecto |
| **Tira 3 columnas con icono + copy** | Pilares / métricas de NEOS (m² desarrollados, unidades, años, regiones) |
| **Grilla de cards editoriales** (imagen + nombre + subtítulo) | Los 5 proyectos en la home |
| **Split asimétrico texto + imagen** | "Quiénes somos" (rediseñado), sección "Por qué invertir con NEOS" |
| **Featured con specs en iconos** | Detalle de cada proyecto: ubicación, dormitorios, estado de obra, amenities |
| **Bloque CTA centrado** ("Descargar brochure") | Por proyecto + uno general en la home |
| **Grilla de "regiones" con imagen + label** | "Dónde construimos": Salta, Cafayate, Cabra Corral, San Antonio, Vaca Muerta |
| **Footer 3 columnas**: marca+social / contacto / dirección+map | Igual estructura, paleta NEOS |

## Motion y microinteracciones

Más rico que conduflex (que es quieto). Sin caer en lo estridente.

- **Reveal on scroll** suave (fade + translate Y) en headings y bloques.
- **Hover cinematográfico** en cards de proyectos: zoom de imagen + overlay con info.
- **Parallax sutil** en imágenes full-bleed (no exagerado).
- **Sticky nav** con transición de fondo (transparente sobre hero → sólido al scrollear).
- **Cursor accents** opcionales en cards (no obligatorio).
- **Transición de página** suave entre home y proyecto.
- **Page load**: fade-in del hero, sin loaders pesados.

## Elementos signature de NEOS a explotar

1. **Patrón topográfico magenta** como background en secciones-divisor y en el detrás del form de contacto.
2. **Isotipo "flor cruzada"** apareciendo como ornamento grande en secciones (no solo en logo).
3. **Claim "Oportunidades que se concretan"** como elemento gráfico recurrente, no solo eslogan.

## Navegación

- **Sticky topbar** con logo izquierda + menú derecha.
- **Menú**: Home — Proyectos ▾ — Nosotros — Contacto.
- "Proyectos" abre dropdown con los 5 (igual que hoy, pero con thumbnails mini).
- **Idioma**: arrancamos solo en español; dejar el switch ES/EN preparado pero hidden hasta confirmar.
- **CTA destacado** en topbar: "Agendar visita" o "Contactar" (botón magenta).

## Footer

3 columnas + bloque legal abajo:

1. **Marca**: logo grande + tagline + redes (FB, IG, LinkedIn).
2. **Contacto**: teléfono, WhatsApp, email, dirección.
3. **Sitemap rápido**: links a secciones principales + lista de proyectos.

Línea inferior: "© 2026 NEOS — Grupo SaltaPor. Todos los derechos reservados."

## Qué NO queremos (descartar del sitio actual)

- Carrousel con thumbnails circulares al borde — reemplazar por hero con jerarquía clara.
- "Quiénes somos" minimalista de 2 líneas — expandir con propuesta de valor + métricas.
- Botón "Más info" roto — todo lo que se vea, funciona.
- Form de contacto con campos sueltos sin diseño — diseñar el form con validación, microcopy y feedback visual.
- Footer plano sin estructura.

## Referencias cruzadas

- Diagnóstico completo del sitio actual: [`brief.md`](../brief.md)
- Material capturado del sitio actual: [`screenshots/`](./screenshots), [`contact.md`](./contact.md), [`sections/`](./sections)

---

_Última actualización: 2026-05-22_
