# Configuración de GoHighLevel para la landing de comunidades

## Estado: PENDIENTE de workflow propio

El circuito técnico ya existe (heredado de la landing de reconstrucción) y está probado:

```
Landing → /api/lead (Vercel, serverless) → Webhook GHL → Workflow → Contacto creado
                    └→ Meta Conversions API (dedup por event_id)
```

Lo que falta es un **workflow de GHL para esta campaña**. El de reconstrucción mapea campos
(`interes`, `plan_nombre`, `valor`) que esta landing ya no manda.

## Cómo montarlo

- **Subcuenta:** bakano (`pEFChujwCCaMWBNbZYD1`)
- Crear carpeta `LEADS MONETIZAR COMUNIDAD` y un workflow con:
  - Trigger: **Webhook entrante** (GHL genera la URL; va en `GHL_WEBHOOK_URL`, nunca en código).
  - GHL exige una **referencia de mapeo** antes de guardar: mandarle una petición de muestra con
    el payload de abajo y elegirla en el dropdown.
  - Acción **Crear contacto**:

| Campo GHL | Variable del webhook |
|---|---|
| Phone | `Inbound Webhook Trigger . Telefono` |
| First name | `Inbound Webhook Trigger . Nombre` |
| Last name | `Inbound Webhook Trigger . Apellido` |
| Contact source | `Inbound Webhook Trigger . Origen` |
| Website / campo custom | `Inbound Webhook Trigger . Instagram` |

  - Acción **Add Tag** leyendo `Inbound Webhook Trigger . Tags`.
  - Condición por `Inbound Webhook Trigger . Etapa`: solo `comunidad_lead` crea contacto. Las
    visitas (`comunidad_view`) llegan sin datos personales y no deben crear contactos vacíos.
  - Si `Tags` contiene `nurture`, no meterlo en el pipeline de ventas.

> **Costo:** el trigger *Webhook entrante* es **premium en GHL y cobra por ejecución**. Cada
> visita y cada lead generan un cargo. Si el tráfico crece, filtrar las visitas antes del webhook
> o dejar de mandarlas.

## Payload que envía el servidor

```json
{
  "etapa": "comunidad_lead",
  "event_id": "lead_…",
  "nombre": "Scarlett", "apellido": "Pérez",
  "full_name": "Scarlett Pérez",
  "telefono": "+593984934039",
  "usuario": "scarlett",
  "instagram": "https://www.instagram.com/scarlett/",
  "tamano": "20k-50k",
  "tamano_nombre": "Entre 20k y 50k",
  "oferta": "servicio",
  "oferta_nombre": "Un servicio (asesorías, sesiones, mentorías)",
  "origen": "landing-comunidad",
  "mes": "septiembre",
  "cupos_restantes": "17",
  "tags": "landing-comunidad,comunidad-20k-50k,oferta-servicio,lead-calificado",
  "fbclid": "", "fbc": "", "fbp": "", "utm_source": "", "…": ""
}
```

### Etiquetas que calcula `api/lead.ts`

| Etiqueta | Cuándo |
|---|---|
| `landing-comunidad` | Siempre |
| `comunidad-menos-20k` / `comunidad-20k-50k` / `comunidad-50k-100k` / `comunidad-100k-mas` | Según el tamaño elegido |
| `oferta-servicio` / `oferta-conocimiento` / `oferta-producto` / `oferta-no-se` | Según lo que quiere vender |
| `lead-calificado` | Comunidad desde 20k |
| `nurture` | Menos de 20k |

`tamano` y `oferta` son los ids de `src/data/comunidad.ts`. Si se cambian ahí, cambian aquí.
`mes` y `cupos_restantes` son el contador de urgencia del día en que entró el lead
(`src/composables/useCupos.ts`); sirven para saber con qué mensaje llegó.

## Meta (CAPI)

- `Lead` cuando la comunidad califica (≥ 20k); `Contact` cuando no.
- Sin `value`: la campaña no tiene precio público.
- `content_name`: `Comunidad <tamaño>`; `content_category`: la oferta.
- El navegador dispara el mismo evento con el mismo `eventID`, así Meta deduplica.

## Secretos

| Dónde | Qué | Visible para |
|---|---|---|
| `.env` local | Valores reales | Solo tu máquina (`.gitignore`) |
| `.env.example` | Plantilla vacía | Público en GitHub, sin secretos |
| Vercel (Secret, Production) | Valores reales | Solo el servidor |

El token de CAPI no va en el bundle. El Pixel `3295262687297231` sí es público (`index.html`).
