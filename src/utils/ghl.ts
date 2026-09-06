/**
 * El navegador ya no habla con GoHighLevel directamente.
 *
 * Todo pasa por `/api/lead` (función serverless en Vercel), que es donde viven la URL del
 * webhook y el token de la Conversions API. El bundle de Vite es público y el repo también:
 * cualquier secreto que se importe aquí queda a la vista de quien lea el JS.
 *
 * Las etiquetas del contacto también se deciden en el servidor — ver `api/lead.ts`.
 */

const ENDPOINT = '/api/lead'

export function generateEventId(prefix = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export interface RespuestaLead {
  ok: boolean
  capi?: boolean
  tags?: string[]
  event_id?: string
}

/**
 * Devuelve si el lead quedó registrado. Las etapas que no son `comunidad_lead`
 * son sólo telemetría y nunca deben interrumpir la UX, así que sus fallos se tragan.
 */
export async function trackStage(
  etapa: string,
  data: Record<string, string> & { event_id?: string },
): Promise<RespuestaLead> {
  const event_id = data.event_id ?? generateEventId('view')
  const esLead = etapa === 'comunidad_lead'

  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        etapa,
        event_id,
        origen_url: window.location.href,
        ...data,
      }),
    })

    if (!r.ok) {
      if (esLead) throw new Error(`El servidor respondió ${r.status}`)
      return { ok: false }
    }

    return (await r.json()) as RespuestaLead
  } catch (e) {
    // Un lead que falla sí tiene que enterarse el usuario; una vista, no.
    if (esLead) throw e
    return { ok: false }
  }
}
