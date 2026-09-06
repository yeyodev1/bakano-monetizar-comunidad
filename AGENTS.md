# Bakano — Monetizar comunidad · Agent Guide

## Commands
```bash
pnpm dev          # Vite dev server
pnpm type-check   # vue-tsc (only check, no build)
pnpm build        # type-check + vite build (parallel via run-p)
pnpm format       # prettier --write src/
pnpm preview      # vite preview
```

No test framework, no CI, no ESLint config exist. `pnpm type-check` is the only quality gate.

## Conventions
- **No semicolons**, single quotes, 100 print width (Prettier enforced).
- **No emojis** — use FontAwesome 6 `<i class="fa-solid fa-...">` (loaded via CDN in `index.html`, not npm).
- **Flex, not grid.** Mobile-first; `@media (min-width: 768px)` to scale up.
- **SCSS color variables** (`$BAKANO-PINK`, `$BAKANO-DARK`, etc.) are auto-injected into every `<style lang="scss">` block by Vite — no explicit `@use` needed in components.
- `@` alias works in both TS imports and SCSS paths (maps to `./src`).
- Node `^20.19.0 || >=22.12.0` required.

## Architecture
Two independent flows share the router (`src/router/index.ts`):

- `/` → `ComunidadView.vue` — **the active landing**. Single page for creators with 20k+ followers
  who want to monetize their community. Sections: hero → Scarlett case → process → cases →
  "is this for you" → contact. Lead form lives in `DiagnosticoModal` + `DiagnosticoForm` (name, WhatsApp, email, Instagram, community name, size, offer; all required). `api/lead.ts` also sends `notas`, an emoji summary for the GHL contact notes — the one place emojis are allowed.
- `/registro-vsl-tr` → legacy VSL funnel (`FunnelView` → `/ver-video` → `/agendar` → `/cita-confirmada`, `/sin-espacio`, `/calificar`). Untouched.
- `/politicas-privacidad`, `/aviso-legal` — legal pages.

SEO is set in the router's `afterEach` hook from each route's `meta`. Edit route `meta` to change page SEO.

**All landing copy comes from `src/data/comunidad.ts`**, which in turn comes from the reel
transcribed in `docs/transcripciones-reels.md`. Do not invent numbers, prices, deadlines, or cases.

**Monthly slots** (`src/composables/useCupos.ts`): urgency counter, not real stock. Day 1 → 20,
last day → 1, linear, resets monthly; computed from browser time. Shown in hero, contact,
sticky `CuposBar`, form and modal. Change `CUPOS_INICIALES` to change the total.

Obsolete files (not in router, do not use): `HomeView.vue`, `ThankYouView.vue`, `ToolsView.vue`.

## Lead pipeline
```
Browser → POST /api/lead (Vercel serverless) ─┬→ GHL inbound webhook → workflow → contact
                                              └→ Meta Conversions API (dedup by event_id)
```
- `src/utils/ghl.ts` → `trackStage(etapa, data)` posts to `/api/lead`. Stage `comunidad_lead` throws on failure (user must see it); `comunidad_view` swallows errors.
- `api/lead.ts` holds the secrets (`GHL_WEBHOOK_URL`, `META_CAPI_TOKEN`), computes tags from `tamano` + `oferta`, and sends Meta `Lead` when the community is ≥ 20k, `Contact` otherwise. Same `califica()` rule as `src/data/comunidad.ts`.
- Payload and tag table: `docs/configuracion-ghl.md`.

## Meta attribution
- Pixel `3295262687297231` is initialized once in `index.html`.
- `src/utils/fbclid.ts` stores `fbclid`/`fbc`/`fbp`/UTMs in `sessionStorage` under `bk_fb`.
- `generateEventId()` → same id goes to the webhook and to `fbq(..., { eventID })` so Meta dedups.

## Pending (see `docs/CONTEXTO.md`)
- Vercel project not created yet.
- Domain undecided: `comunidad.bakano.ec` is a placeholder in router, `index.html`, `public/`, `api/lead.ts`.
- GHL workflow: webhook configured in Vercel; map `email`, `instagram`, `comunidad`, `notas` and `tags` inside GHL (see docs/configuracion-ghl.md).

## Vite quirks
- `server.allowedHosts` includes an ngrok tunnel — add yours there for tunnel testing.
- `vite-plugin-vue-devtools` active in dev.
- `.env` is gitignored — copy `.env.example`.
