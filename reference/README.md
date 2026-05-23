# reference/

Material extraído del sitio actual de NEOS ([neos.ar](https://www.neos.ar/)) para usar como insumo del rediseño. **No es código del proyecto** — sirve solo para que yo lea estructura, copy e identifique secciones/proyectos.

## Cómo usar esta carpeta

Pegá lo que vayas recopilando en los archivos correspondientes. Si no existe el archivo que necesitás, creá uno nuevo con un nombre descriptivo.

### Estructura sugerida

```
reference/
  home.html              ← Copy outerHTML de la home (o por secciones, ver abajo)
  sections/              ← Si preferís dividir la home sección por sección
    hero.html
    proyectos.html
    nosotros.html
    contacto.html
  projects/              ← HTML de páginas internas de cada proyecto
    chaquies.html
    mercatus.html
  screenshots/           ← Capturas (PNG/JPG) — desktop y mobile
  copy.md                ← Copy textual suelto (si no querés pegar HTML)
  contact.md             ← Datos de contacto (dirección, tel, mail, redes)
```

### Cómo capturar HTML desde DevTools

1. F12 → pestaña **Elements**.
2. Click derecho sobre el `<section>` (o el nodo que quieras) → **Copy → Copy outerHTML**.
3. Pegá en el archivo correspondiente acá.

### Qué priorizar

1. **Screenshots** de cada sección (desktop). Es lo más útil para entender el look actual.
2. **Listado completo de proyectos** con nombre, ubicación, estado, copy.
3. **Datos de contacto** y redes sociales.
4. HTML de la home (sirve para mapear estructura y copy textual).
