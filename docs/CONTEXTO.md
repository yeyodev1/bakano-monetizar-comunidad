# Contexto del proyecto — landing de monetización de comunidades

Todo lo que hace falta saber para retomar esto sin volver a preguntar. Lo que no está aquí
está en `CLAUDE.md` (arquitectura y convenciones) o en `docs/configuracion-ghl.md` (el CRM).

## Qué es esto y por qué

Bakano (agencia de performance marketing, Guayaquil) publicó el 5 de septiembre de 2026 un reel
con el caso de **Scarlett**: una creadora con comunidad grande que no facturaba, y que tras un
mes de implementación con Bakano facturó **$1,000 el día del lanzamiento**. Esta landing
convierte la atención de ese reel en leads: **creadores con comunidades desde 20k seguidores**
que quieren venderle algo a su audiencia y no saben cómo estructurarlo.

Nació el 6 de septiembre de 2026 como derivado de la landing de reconstrucción
(`bakano-reconstruccion-leads`), de la que hereda arquitectura, backend y estilo. El mensaje
se giró entero; la infraestructura se reutilizó.

**No inventar datos.** Todo lo que dice la landing sale del reel y su caption, transcritos en
`docs/transcripciones-reels.md`:

| Dato | Valor |
|---|---|
| Caso principal | Scarlett: idea y conocimiento sí, estructura no |
| Resultado | $1,000 el día del lanzamiento; siguió facturando |
| Segundo caso | Andersson Boscán: audiencia sí, proceso de ventas no |
| Qué hace Bakano | Diagnóstico de fortalezas, empaquetar oferta, web + conexión con redes, lanzamiento |
| Diagnóstico | El problema no es el algoritmo ni la pauta: es estructura |

**Lo que NO sale del reel:** el umbral de **20k seguidores** lo fijó Bakano para esta campaña.
El reel tampoco da precio ni plazo, así que la landing no los pone: el CTA es un diagnóstico
por WhatsApp. Si en algún momento hay precio público, va en `src/data/comunidad.ts`.

### Decisiones editoriales

- **Sin precio, sin cupos, sin urgencia falsa.** No hay dato que lo respalde.
- **Scarlett se nombra solo por su nombre**, como en el reel. No se pone apellido ni handle.
- **Andersson Boscán** ya era cliente de web (anderssonboscan.ec); su captura está en
  `src/assets/portfolio/andersson.png`. Es el único sitio del portafolio que se conserva.
- El formulario **califica por tamaño de comunidad**: menos de 20k va a nurture, no al
  pipeline. Meta recibe `Lead` solo si califica; si no, `Contact`.

## Arquitectura, en una línea

```
Navegador → POST /api/lead (Vercel serverless) ─┬→ Webhook GHL → workflow → contacto
                                                └→ Meta Conversions API (dedup por event_id)
```

El backend existe para que el token de CAPI y la URL del webhook no viajen en el bundle público.
Detalle en `CLAUDE.md`.

## Enlaces

| | |
|---|---|
| GitHub | https://github.com/yeyodev1/bakano-monetizar-comunidad |
| Reel origen | https://www.instagram.com/reel/Dc6XD6TFRvV/ |
| Proyecto Vercel | **Pendiente de crear** (ver abajo) |
| Dominio | **Pendiente.** Los canonicals apuntan a `https://comunidad.bakano.ec/` como supuesto |

## Estado real

**Hecho el 2026-09-06:**

- Repo nuevo creado y `origin` apuntando a él.
- Landing entera girada al mensaje del reel: hero, caso Scarlett (timeline + reel embebido),
  proceso en 4 pasos, casos (Scarlett y Andersson), "¿es para ti?", formulario.
- `api/lead.ts` adaptado: etapas `comunidad_view` / `comunidad_lead`, campos `usuario`,
  `tamano`, `oferta`, etiquetas nuevas.

**Pendiente, en orden:**

1. **Crear el proyecto en Vercel** conectado a este repo y cargar las variables de
   `.env.example` como Secrets. Sin eso, `/api/lead` no existe.
2. **Decidir el dominio** y reemplazar `comunidad.bakano.ec` en `src/router/index.ts`,
   `index.html`, `public/sitemap.xml`, `public/robots.txt` y `api/lead.ts`.
3. **Workflow de GHL propio.** El `GHL_WEBHOOK_URL` de la landing anterior funciona técnicamente,
   pero ese workflow mapea `interes`/`plan_nombre`, que ya no existen. Crear uno nuevo con el
   payload de `docs/configuracion-ghl.md`.
4. Confirmar con Bakano el umbral de 20k y las opciones de "¿qué quieres venderle?".
5. Imagen OG propia de la campaña: hoy usa `https://bakano.ec/image.png`.

## Cosas que costaron descubrir

- **Instagram no entrega el reel sin login** ni a `yt-dlp` ni a `curl`. Lo que sí funciona: abrir
  el post en un navegador limpio (`agent-browser`), leer el caption del `og:description` y sacar
  la URL de la pista de audio (`dash_ln_heaac_vbr3_audio`) de `performance.getEntriesByType`.
  Quitándole `bytestart`/`byteend` se descarga entera; luego `ffmpeg` a WAV 16k y `whisper-cli`
  con `~/.cache/whisper-models/ggml-small.bin`.
- Whisper transcribe "Bakano" como "abacano" y "Andersson Boscán" como "Antes on Buscan".
- El resto de trucos (Vite `additionalData`, rewrite de Vercel, E.164 en GHL, trigger webhook
  premium en GHL) están en `CLAUDE.md` y `docs/configuracion-ghl.md`.

## Secretos: dónde vive cada cosa

| Dónde | Qué | Visible para |
|---|---|---|
| `.env` local | Valores reales | Solo esta máquina (`.gitignore`) |
| `.env.example` | Plantilla vacía | Público, sin secretos |
| Vercel (Secret, Production) | Valores reales | Solo el servidor |

El Pixel `3295262687297231` **sí** es público y va en `index.html` — eso es correcto.
