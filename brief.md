# newNeos — Brief de rediseño

> Documento de trabajo. Resume el estado actual de NEOS y los lineamientos del rediseño.

## Objetivo

Rediseño **total** de [neos.ar](https://www.neos.ar/) con un look & feel **moderno, llamativo y memorable**, manteniendo el ADN de marca (paleta magenta/negro, símbolo "neos", claim "Oportunidades que se concretan") pero rompiendo por completo con la estructura y estética básica del sitio actual.

## Marca

- **Nombre**: NEOS
- **Pertenencia**: desarrolladora del **Grupo SaltaPor**
- **Claim oficial**: **"Oportunidades que se concretan"**
- **Tipografía del logo**: sans-serif fino, lowercase ("neos"), con marca registrada (®)
- **Símbolo / isotipo**: flor de 4 pétalos con orificio central (forma cruz + círculo), en magenta
- **Paleta detectada**:
  - **Negro** `#0A0A0A` aprox. (background dominante)
  - **Magenta / fucsia** `#E91E8C` aprox. (acento — botones, headings, logo)
  - **Gris claro** `#D3D3D3` aprox. (secciones secundarias tipo "Quiénes somos")
  - **Blanco** (texto sobre negro)
  - Azul medio en botón Enviar (probable accidente, no parece intencional)
- **Recurso visual recurrente**: **patrón topográfico / curvas de nivel** en magenta sobre negro (líneas orgánicas tipo mapa) — se repite en footer y CTAs. Es el grafismo más característico de la marca.

## Copy actual relevado

### Hero (carrousel)
- Cada slide muestra **un proyecto**: imagen full-bleed + nombre del proyecto + subtítulo corto + CTA "**Ver proyecto**" (botón magenta).
- Ej. visto: *"Greet Balcarce — Un punto de bienvenida en la ciudad"*.
- 5 thumbnails circulares debajo (avatars) para navegar entre proyectos.

### Quiénes somos
> **¿Quiénes somos?**
> Somos una desarrolladora de productos de real estate que busca siempre las mejores oportunidades de inversión para sus clientes.

(Sección muy pobre, solo texto + isotipo grande al costado. Hay que reescribirla y enriquecerla.)

### Sección "Oportunidades que se concretan"
- Aparece como banner/divisor con el patrón topográfico de fondo.
- Es más decorativo que informativo.

### Form de contacto
- Campos: **Nombre, E-mail, Teléfono, Mensaje (optional), botón Enviar**.
- Aparece en home y se **repite en cada página de proyecto**.

### Footer
- Bloque "Contacto" en magenta con:
  - 0387 146 328 278
  - info@neos.ar
  - Leguizamón 1946 - Salta - Argentina
  - +5493872233240
- Iconos: Facebook, Instagram, LinkedIn

### Elementos flotantes
- WhatsApp (círculo verde, abajo a la derecha) — persistente en todo el scroll.

## Topbar / navegación

- **Logo** (izquierda) | **Home — Proyectos ▾ — Contacto** (derecha)
- "Proyectos" abre dropdown con los **5 proyectos**.
- Los 3 items principales son anclas que scrollean dentro de la home; cada proyecto va a su ruta propia.

## Los 5 proyectos

Listados en el dropdown del menú:

1. **Neweken**
2. **El Cauce Castellanos**
3. **Mercatus** *(Cafayate)*
4. **Greet Balcarce** *(Anteproyecto — "Un punto de bienvenida en la ciudad")*
5. **Chaquíes** *(Cafayate — 4 torres, 176 deptos, >50% obra)*

### Estructura actual de cada página de proyecto

- Hero con nombre del proyecto + botón "**Más info**" (**ROTO** — no hace nada).
- Tag tipo "Anteproyecto" / estado de obra.
- Título principal del proyecto (claim corto).
- Descripción (1 párrafo).
- 3 botones grandes:
  - **Plantas** → Google Drive (PDF)
  - **Brochure** → Google Drive (PDF)
  - **Avance de obra** → YouTube (video)
- Mapa de Google Maps embebido con la ubicación.
- **Mismo form de contacto** que la home.

### Material disponible localmente

- `reference/sections/GREET Versión7.pdf` — brochure de Greet Balcarce (debería ir en `reference/projects/`, lo movemos cuando armemos data).
- Screenshots: `home1.png` → `home6.png` y `GreetBalcarce.png`.
- **Pendiente** (decís haberlos dejado pero no los veo en el repo aún): links de Google Maps y de YouTube por proyecto. Cuando los tengas, sumalos a `reference/contact.md` o a un `reference/projects.md` nuevo.

## Diagnóstico del sitio actual (qué romper, qué mantener)

### Mantener / reforzar
- Identidad de marca: paleta **magenta + negro**, isotipo, claim "Oportunidades que se concretan".
- Patrón topográfico (es lo más memorable visualmente — usarlo mejor).
- Estructura de **5 proyectos como núcleo del negocio**.
- WhatsApp flotante.
- Form de contacto repetido en cada proyecto (buena práctica de conversión).

### Romper / rediseñar
- **Carrousel genérico** → reemplazar por hero con jerarquía clara y storytelling.
- **"Quiénes somos" anémico** → expandir con propuesta de valor real, métricas (m² desarrollados, unidades vendidas, años de trayectoria, regiones), respaldo Grupo SaltaPor.
- **Cero animaciones / scroll plano** → microinteracciones, reveal on scroll, parallax sutil, hover cinematográfico en cards.
- **Páginas de proyecto pobres** → galería de imágenes, especificaciones técnicas (m², dormitorios, amenities), timeline de obra, render 3D embed, FAQs.
- **Botón "Más info" roto** → no debe quedar nada roto.
- **Form básico** → form con validación, confirmación visual, integración con email/CRM.
- **Footer plano** → footer estructurado con sitemap, newsletter opcional, links útiles.
- **Sin sección de credenciales** → faltan medios donde aparecieron (El Tribuno, etc.), reconocimientos, alianzas.
- **Sin mapa de presencia geográfica** → mostrar las 5 regiones donde NEOS opera.

## Stack técnico (configurado)

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4 + DaisyUI v5
- Yarn (`yarn start`)

## Decisiones pendientes

- [ ] **Referencias visuales**: el usuario va a pasar inspiración de otras páginas → definir dirección estética concreta.
- [ ] **Idioma**: solo español o también inglés (relevante por Vaca Muerta / inversores).
- [ ] **CMS**: hardcodear los 5 proyectos al inicio, o conectar headless CMS (Sanity / Contentful) desde día uno.
- [ ] **Routing**: confirmamos multi-página (home + 1 ruta por proyecto), pero ¿agregamos `/nosotros`, `/contacto`, `/blog`?
- [ ] **Form**: ¿integramos servicio (Formspree / Resend / HubSpot) o lo dejamos como mailto inicial?
- [ ] **Identidad visual**: ¿mantenemos paleta y logo, o también se rediseñan?

---

_Última actualización: 2026-05-22_
