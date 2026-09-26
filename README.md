# newNeos

Rediseño total de la landing de [NEOS](https://www.neos.ar/), desarrolladora del Grupo SaltaPor.

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **DaisyUI v5** (tema custom `neos` con paleta magenta/negro)
- **React Router v7**
- **Yarn** como package manager

## Comandos

```bash
yarn         # instalar dependencias
yarn start   # dev server (http://localhost:5173)
yarn build   # build de producción
yarn preview # preview del build
yarn snapshot # regenera el snapshot de contenido desde Supabase (ver § Contenido)
yarn lint    # ESLint
```

## Contenido

El contenido de la landing (proyectos y regiones) vive en **Supabase**, no en el
código — NEOS lo administra desde un panel. Ver [`supabase/README.md`](./supabase/README.md).

`src/data/content.snapshot.ts` es una copia generada de ese contenido. La app la
usa como `placeholderData`: la home pinta instantánea con el último snapshot y
se actualiza sola cuando responde la base. También es la red de seguridad si
Supabase está caído o pausado.

**Hay que correr `yarn snapshot` antes de cada deploy**, o el sitio se publica
con el contenido de la última vez que alguien lo corrió. No está enganchado al
`build` a propósito: un build no debería fallar por un problema de red.

## Rutas

| Ruta | Vista |
|---|---|
| `/` | Home (hero, métricas, proyectos, nosotros, regiones, brochure CTA, contacto) |
| `/proyectos/:slug` | Detalle por proyecto (Chaquíes y Neweken completos, resto "próximamente") |

## Estructura

```
src/
├── App.tsx                  # Router + layout compartido
├── pages/                   # Home, ProjectDetail, ProjectNeweken, ProjectComingSoon
├── components/
│   ├── layout/              # Topbar, Footer, WhatsAppFab, ScrollManager
│   ├── sections/            # Hero, Pillars, Projects, About, Regions, BrochureCTA, Contact
│   └── ui/                  # NeosLogo, NeosMark, TopoPattern, Reveal, CountUp, HeroImageCarousel, WhatsAppIcon
├── data/                    # projects, regions, pillars
└── hooks/                   # useReveal
```

## Documentación del proyecto

- [`brief.md`](./brief.md) — diagnóstico del sitio actual + lineamientos del rediseño
- [`reference/inspiration.md`](./reference/inspiration.md) — dirección estética
- [`reference/contact.md`](./reference/contact.md) — datos de contacto + links externos por proyecto

## Material de referencia (no versionado)

La carpeta `reference/` local contiene assets de origen (PDFs de brochures, screenshots del sitio anterior, renders de proyectos). El repo solo trackea los `.md`. Las imágenes que usa la app viven en [`public/projects/`](./public/projects/).
