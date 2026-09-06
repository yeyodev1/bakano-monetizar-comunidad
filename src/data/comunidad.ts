import andersson from '@/assets/portfolio/andersson.png'

/**
 * Todo el contenido de la landing sale del reel de @bakano.ec sobre Scarlett
 * (docs/transcripciones-reels.md). No inventar cifras ni casos que no estén ahí.
 */

/** Reel que origina la campaña: el caso de Scarlett. */
export const REEL_CODE = 'Dc6XD6TFRvV'
export const REEL_URL = `https://www.instagram.com/reel/${REEL_CODE}/`

/** Umbral de comunidad con el que trabajamos. */
export const MINIMO_SEGUIDORES = '20k'

export type TamanoId = 'menos-20k' | '20k-50k' | '50k-100k' | '100k-mas'
export type OfertaId = 'servicio' | 'conocimiento' | 'producto' | 'no-se'

export interface Opcion<T extends string> {
  id: T
  icono: string
  texto: string
}

export const tamanos: Opcion<TamanoId>[] = [
  { id: 'menos-20k', icono: 'fa-seedling', texto: 'Menos de 20k' },
  { id: '20k-50k', icono: 'fa-users', texto: 'Entre 20k y 50k' },
  { id: '50k-100k', icono: 'fa-users-line', texto: 'Entre 50k y 100k' },
  { id: '100k-mas', icono: 'fa-crown', texto: 'Más de 100k' },
]

export const ofertas: Opcion<OfertaId>[] = [
  { id: 'servicio', icono: 'fa-handshake', texto: 'Un servicio (asesorías, sesiones, mentorías)' },
  { id: 'conocimiento', icono: 'fa-graduation-cap', texto: 'Lo que sé (cursos, talleres, guías)' },
  { id: 'producto', icono: 'fa-box-open', texto: 'Un producto físico o digital' },
  { id: 'no-se', icono: 'fa-circle-question', texto: 'Todavía no lo tengo claro' },
]

/** Solo comunidades desde 20k entran al pipeline; el resto va a nurture. */
export const califica = (t: string) => t !== '' && t !== 'menos-20k'

export const etiquetaTamano = (t: string) => tamanos.find((x) => x.id === t)?.texto ?? ''
export const etiquetaOferta = (o: string) => ofertas.find((x) => x.id === o)?.texto ?? ''

/** El caso de Scarlett, en el orden en que lo cuenta el reel. */
export const historia = [
  {
    icono: 'fa-users',
    fecha: 'El punto de partida',
    titulo: 'Una comunidad grande que no facturaba',
    texto:
      'Scarlett tenía la idea, el conocimiento y una audiencia fiel. Lo que le faltaba era la estructura para convertir a sus seguidores en clientes.',
  },
  {
    icono: 'fa-compass-drafting',
    fecha: 'El primer mes',
    titulo: 'Implementación y estrategia',
    texto:
      'Fue el mes más duro. Entendimos sus fortalezas como creadora y las de su comunidad, y empaquetamos lo que tenía que decir y el valor que podía entregar.',
  },
  {
    icono: 'fa-diagram-project',
    fecha: 'La conexión',
    titulo: 'Redes, web y ventas en un solo proceso',
    texto:
      'Levantamos su página web y conectamos sus redes sociales con un proceso de marketing y ventas claro. Lo que ella quería vender, con la audiencia que le quería comprar.',
  },
  {
    icono: 'fa-rocket',
    fecha: 'El lanzamiento',
    titulo: '$1,000 el primer día',
    texto:
      'El sistema funcionó desde el minuto uno. Facturó $1,000 el día del lanzamiento y siguió facturando los días siguientes.',
  },
]

/** Lo que hacemos con cada comunidad, generalizado del caso de Scarlett. */
export const proceso = [
  {
    icono: 'fa-magnifying-glass-chart',
    titulo: 'Diagnóstico de fortalezas',
    texto: 'Qué tienes tú como creador y qué tiene tu comunidad. Ahí está lo que se puede vender.',
  },
  {
    icono: 'fa-box-archive',
    titulo: 'Empaquetar tu oferta',
    texto:
      'Convertimos lo que sabes y lo que haces en algo concreto, con nombre, precio y una razón clara para comprarlo.',
  },
  {
    icono: 'fa-diagram-project',
    titulo: 'Web y proceso de ventas',
    texto:
      'Levantamos tu página y la conectamos con tus redes, para que la atención que ya tienes termine en una venta.',
  },
  {
    icono: 'fa-rocket',
    titulo: 'Lanzamiento',
    texto:
      'Salimos con todo montado. El objetivo es que el sistema funcione desde el primer día, no después de improvisar.',
  },
]

export interface Caso {
  nombre: string
  rol: string
  resultado: string
  texto: string
  img?: string
  url?: string
  reel?: string
}

/** Los dos casos que nombra el reel. Nada más. */
export const casos: Caso[] = [
  {
    nombre: 'Scarlett',
    rol: 'Creadora · comunidad grande sin monetizar',
    resultado: '$1,000 el día del lanzamiento',
    texto:
      'Tenía la idea y el conocimiento, pero le faltaba la estructura. Empaquetamos su oferta, levantamos su web y la conectamos con sus redes.',
    reel: REEL_URL,
  },
  {
    nombre: 'Andersson Boscán',
    rol: 'Periodista · marca personal',
    resultado: 'Proceso de ventas concretado',
    texto:
      'La audiencia ya la tenía. Lo que faltaba era un proceso de ventas que la aprovechara. Lo construimos junto con su sitio.',
    img: andersson,
    url: 'https://anderssonboscan.ec/',
  },
]

/** Para quién es (y para quién no). */
export const requisitos = [
  {
    icono: 'fa-users',
    titulo: `Tienes una comunidad desde ${MINIMO_SEGUIDORES} seguidores`,
    texto: 'En Instagram, TikTok, YouTube o donde sea que tu gente ya te presta atención.',
  },
  {
    icono: 'fa-lightbulb',
    titulo: 'Tienes algo que vender, o casi',
    texto: 'Un servicio, un conocimiento, un producto. Aunque todavía no sepas cómo presentarlo.',
  },
  {
    icono: 'fa-hourglass-half',
    titulo: 'Estás estancado',
    texto:
      'Publicas, te ven, te escriben. Pero eso no se convierte en facturación de forma profesional.',
  },
]
