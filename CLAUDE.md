# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
pnpm dev          # Vite dev server (5173, cae a 5174 si está ocupado)
pnpm type-check   # vue-tsc --build (solo chequeo)
pnpm build        # type-check + vite build en paralelo (run-p)
pnpm preview      # sirve el build
pnpm format       # prettier --write src/
```

No hay test runner, ESLint ni CI en este repo. `pnpm type-check` es la única compuerta de calidad — córrelo antes de dar por terminado un cambio.

## Qué es este repo

Landing de captación de leads de **Bakano** (agencia de performance marketing, Guayaquil).

**Campaña vigente:** monetización de comunidades. La landing raíz (`/`) se dirige a **creadores
con comunidades desde 20k seguidores** que no facturan con ellas, y capta leads para un
diagnóstico por WhatsApp. **No hay VSL en el flujo principal** — el funnel VSL viejo sigue en el
repo pero movido a `/registro-vsl-tr`.

Todo el contenido sale de un reel de @bakano.ec (el caso de Scarlett) y no debe inventarse ni inflarse:

| Dato | Valor |
|---|---|
| Caso principal | Scarlett: tenía idea y conocimiento, le faltaba estructura |
| Resultado | $1,000 el día del lanzamiento; siguió facturando después |
| Segundo caso | Andersson Boscán: la audiencia ya la tenía, se concretó su proceso de ventas |
| Qué hace Bakano | Diagnóstico de fortalezas → empaquetar oferta → web + conexión con redes → lanzamiento |
| Precio | **No hay.** El reel no lo da; la landing no lo inventa |
| Umbral 20k | Lo fijó Bakano para la campaña; no sale del reel |
| Cupos | **20 al mes**, mecánica de urgencia de Bakano (no del reel). Ver "Cupos mensuales" |

La transcripción y el caption del reel están en `docs/transcripciones-reels.md`; el porqué de
cada decisión de copy, en `docs/CONTEXTO.md`. **Léelos antes de tocar el mensaje.**

Scarlett se nombra solo por su nombre, como en el reel. No agregues apellido, handle ni datos
que no estén en la transcripción.

## Arquitectura

Vue 3 + Vite 7 + TS, SCSS, `vue-router`. Sin Pinia en la landing nueva (el funnel viejo sí usa un store).

**Rutas** (`src/router/index.ts`) — dos flujos independientes conviviendo:

- `/` → `ComunidadView.vue` — **la landing activa**. Página única: hero → caso Scarlett →
  proceso → casos → ¿es para ti? → contacto. Sin guards, sin pasos.
- `/registro-vsl-tr` → funnel VSL legado: `FunnelView` → `/ver-video` → `/agendar` → `/cita-confirmada`, con `/sin-espacio` como rama de descalificación y `/calificar` como página suelta.
- `/politicas-privacidad`, `/aviso-legal` — legales.

El SEO **no** se define en los componentes: vive en el `meta` de cada ruta y el hook `afterEach` del router lo escribe en el `<head>` (title, description, og:*, canonical). Para cambiar el SEO de una página, edita su `meta` en el router.

El dominio es `comunidad.bakano.ec` y está en `src/router/index.ts`, `index.html`,
`public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` y `api/lead.ts`.

Archivos obsoletos, no usar: `HomeView.vue`, `ThankYouView.vue`, `ToolsView.vue`.

### Cupos mensuales (`src/composables/useCupos.ts`)

La urgencia de la landing es un contador determinista, no un stock real:
**día 1 del mes → 20 cupos, último día → 1, lineal entre medio, y vuelve a 20 al cambiar de mes.**
Se calcula con la hora del navegador; dos personas el mismo día ven el mismo número.
`calcularCupos(fecha)` es pura (fácil de probar); `useCupos()` la hace reactiva y se refresca sola
si la pestaña cruza la medianoche.

El número aparece en: badge y meter del hero, subtítulo de "¿Es para ti?", título y meter de
contacto, barra fija inferior (`CuposBar`, aparece tras el hero), encabezado y botón del
formulario, y la confirmación del modal. El lead manda `mes` y `cupos_restantes` a GHL.
Para cambiar el total, toca `CUPOS_INICIALES` y nada más.

### Contenido y componentes de la landing

- `src/data/comunidad.ts` — **única fuente del contenido**: reel, historia de Scarlett, pasos del
  proceso, casos, requisitos, y las opciones del formulario (`tamanos`, `ofertas`). La función
  `califica(tamano)` decide quién entra al pipeline; el servidor replica el mismo criterio.
- `src/components/comunidad/` — `CasoSection`, `ProcesoSection`, `CasosSection`,
  `ParaQuienSection`, `DiagnosticoModal` + `DiagnosticoForm`, `CuposMeter`, `CuposBar`, más
  `PhoneField`, `CountryPicker`, `ScrollCue`, `ScrollProgress` reutilizables.
- `src/styles/comunidad.scss` — mixins compartidos (`seccion`, `titulo`, `subtitulo`, `cta`, `campo`).

### El backend (`api/lead.ts`)

Hay **una** función serverless. Vercel convierte cualquier archivo de `/api` en un endpoint HTTP;
no hay servidor que levantar ni deploy aparte.

```
Navegador → POST /api/lead ─┬→ Webhook GHL → workflow → contacto
                            └→ Meta Conversions API (dedup por event_id)
```

Existe por una razón concreta: **el bundle de Vite es público y el repo también**. Cualquier
secreto importado desde `src/` queda a la vista. El token de CAPI y la URL del webhook viven en
variables de entorno del servidor (`.env` local, Secrets en Vercel) y **nunca** llegan al
navegador.

`api/lead.ts` también decide las **etiquetas** del contacto según `tamano` y `oferta`, y manda a
Meta `Lead` si la comunidad califica (≥ 20k) o `Contact` si no. El payload completo y las
etiquetas están en `docs/configuracion-ghl.md`.

Variables requeridas — plantilla en `.env.example`:
`GHL_WEBHOOK_URL`, `META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_CAPI_TEST_CODE` (opcional).

`api/**/*.ts` se type-checkea vía `tsconfig.node.json`.

### Despliegue

Vercel, proyecto `proyectos-de-diego/bakano-monetizar-comunidad`, conectado a GitHub: **cada push
a `main` redespliega**. Dominio `comunidad.bakano.ec` (DNS en Cloudflare, registro A a
`76.76.21.21`). La URL `*.vercel.app` está detrás del SSO de Vercel; el dominio propio no.
`vercel.json` tiene el rewrite de SPA — sin él, entrar directo a una ruta interna da 404.

### Cómo salen los leads

`trackStage(etapa, data)` en `src/utils/ghl.ts` postea a `/api/lead`, **no a GHL**. Un lead que falla
**sí lanza** para que el usuario vea el error; las etapas de simple visita se tragan los fallos,
porque el tracking nunca debe romper la UX.

`ComunidadView` emite dos etapas: `comunidad_view` al montar y `comunidad_lead` al enviar el formulario.

### Atribución de Meta

El Pixel `3295262687297231` ya está inicializado en `index.html` (script inline + `noscript`). No lo dupliques en componentes.

`src/utils/fbclid.ts` captura `fbclid`, `_fbc`, `_fbp` y los UTMs a `sessionStorage` bajo `bk_fb`. El patrón, en orden:

1. `captureFbParams()` en el `onMounted` de la vista de entrada.
2. `getStoredFbParams()` al enviar, y esparcirlo en el payload de `trackStage`.
3. `generateEventId()` produce un `event_id` que va **tanto** al webhook como al `eventID` de `fbq` — así Meta deduplica el evento del browser contra el server-side. Si mandas uno sin el otro, los eventos se cuentan doble.

`fbq` no está tipado; el repo usa `;(window as any).fbq?.(...)` — respeta el punto y coma inicial, hace falta porque no hay semicolons.

El **access token de CAPI es secreto de servidor**: nunca en el bundle de Vite ni en el repo. Todo lo que entra a `src/` es público.

### Convenciones

- **Sin punto y coma**, comillas simples, ancho 100 (Prettier).
- **Sin emojis en el código ni la UI** — íconos FontAwesome 6 vía CDN: `<i class="fa-solid fa-...">`.
- **Flex, no grid.** Mobile-first: escribe el estilo base para móvil y usa `@media (min-width: 768px)` para subir. Verifica que no haya scroll horizontal.
- Las variables SCSS de marca (`$BAKANO-PINK`, `$BAKANO-DARK`, `$BAKANO-LIGHT`, `$BAKANO-PURPLE`, `$BAKANO-GREEN`) se **auto-inyectan** en todo bloque `<style lang="scss">` vía `additionalData` en `vite.config.ts`. No pongas `@use` en los componentes. La excepción es `src/styles/comunidad.scss`: como no es hoja de entrada, importa las variables a mano.
- Alias `@` → `./src`, funciona en imports TS y en rutas SCSS.
- Tipografía: Outfit (títulos, 800), Plus Jakarta Sans (cuerpo), Space Grotesk (CTAs), Manrope (UI).

### Imágenes

- `src/assets/portfolio/andersson.png` — captura real de anderssonboscan.ec (1280×900), el único
  sitio del portafolio que se conserva. Regenerar con `agent-browser set viewport 1280 900` + `open` + `screenshot`.
- El reel de Scarlett va **embebido** desde Instagram (`/reel/<code>/embed/`), no descargado.

### Notas de Vite

`server.allowedHosts` trae un host de ngrok fijo — agrega el tuyo ahí para probar por túnel.
