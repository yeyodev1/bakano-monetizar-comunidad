# bakano-monetizar-comunidad

Landing de captación de leads de [Bakano](https://bakano.ec) para **creadores con comunidades
desde 20k seguidores** que quieren monetizarlas. Nace del reel del caso de Scarlett:
https://www.instagram.com/reel/Dc6XD6TFRvV/

Vue 3 + Vite + TypeScript, con una función serverless en `api/lead.ts` que reenvía los leads a
GoHighLevel y a la Conversions API de Meta sin exponer secretos en el navegador.

## Desarrollo

```sh
pnpm install
cp .env.example .env   # rellenar con los valores reales
pnpm dev
pnpm type-check        # única compuerta de calidad
pnpm build
```

## Documentación

- `CLAUDE.md` — arquitectura, convenciones y reglas de contenido.
- `docs/CONTEXTO.md` — por qué existe, decisiones editoriales, pendientes.
- `docs/transcripciones-reels.md` — el reel transcrito: la única fuente de datos de la landing.
- `docs/configuracion-ghl.md` — el CRM: payload, etiquetas, workflow.
