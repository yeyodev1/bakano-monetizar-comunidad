import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import CalificarView from '../views/CalificarView.vue'
import FunnelView from '../views/FunnelView.vue'
import ComunidadView from '../views/ComunidadView.vue'
import VideoView from '../views/VideoView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import LegalNoticeView from '../views/LegalNoticeView.vue'
import BookingView from '../views/BookingView.vue'
import BookedView from '../views/BookedView.vue'
import NoSpaceView from '../views/NoSpaceView.vue'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description: string
    canonical: string
    ogTitle: string
    ogDescription: string
    ogUrl: string
    jsonLd?: object[]
  }
}

// ── Router ─────────────────────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  routes: [
    {
      path: '/',
      name: 'comunidad',
      component: ComunidadView,
      meta: {
        title:
          'Monetiza tu comunidad | Bakano \u2014 Para creadores con m\u00e1s de 20k seguidores',
        description:
          'Tienes una comunidad grande pero no factura. Empaquetamos tu oferta, levantamos tu web y conectamos tus redes con un proceso de ventas. Con Scarlett: $1,000 el d\u00eda del lanzamiento.',
        canonical: 'https://comunidad.bakano.ec/',
        ogTitle: 'Tienes una comunidad grande. Pero no factura.',
        ogDescription:
          'Para creadores con m\u00e1s de 20k seguidores. El problema no es el algoritmo ni la pauta: es estructura. Te ayudamos a empaquetar y vender.',
        ogUrl: 'https://comunidad.bakano.ec/',
      } satisfies RouteMeta,
    },
    {
      path: '/registro-vsl-tr',
      name: 'funnel',
      component: FunnelView,
      meta: {
        title: 'Bakano | Crecimiento para negocios que facturan m\u00e1s de $20k',
        description:
          'Ayudamos a due\u00f1os y socios de negocios que facturan m\u00e1s de $20,000 al mes a crecer entre un 10% y 20% con la metodolog\u00eda Data Growth Business.',
        canonical: 'https://mkt.bakano.ec/registro-vsl-tr',
        ogTitle: 'Bakano | Aumenta tu facturaci\u00f3n entre 10% y 20%',
        ogDescription:
          'Metodolog\u00eda Data Growth Business para due\u00f1os y socios de negocios que facturan m\u00e1s de $20,000 al mes.',
        ogUrl: 'https://mkt.bakano.ec/registro-vsl-tr',
      } satisfies RouteMeta,
    },
    {
      path: '/ver-video',
      name: 'video',
      component: VideoView,
      meta: {
        title: 'Mira el video | Bakano — Paso 1 de 2',
        description:
          'Ve el video completo y descubre cómo la metodología Data Growth Business puede aumentar la facturación de tu negocio entre un 10% y 20%.',
        canonical: 'https://bakano.ec/ver-video',
        ogTitle: 'Mira el video | Bakano',
        ogDescription: 'Ve el video y agenda tu Cita Estratégica gratuita con el equipo de Bakano.',
        ogUrl: 'https://bakano.ec/ver-video',
      } satisfies RouteMeta,
    },
    {
      path: '/agendar',
      name: 'booking',
      component: BookingView,
      meta: {
        title: 'Agenda tu Cita | Bakano — Paso 2 de 2',
        description:
          'Selecciona el día y hora para tu Cita Estratégica gratuita con el equipo de Bakano.',
        canonical: 'https://bakano.ec/agendar',
        ogTitle: 'Agenda tu Cita | Bakano',
        ogDescription: 'Elige tu horario y reserva tu Cita Estratégica gratuita con Bakano.',
        ogUrl: 'https://bakano.ec/agendar',
      } satisfies RouteMeta,
    },
    {
      path: '/cita-confirmada',
      name: 'booked',
      component: BookedView,
      meta: {
        title: 'Cita Confirmada | Bakano',
        description:
          'Tu cita estratégica con el equipo de Bakano está confirmada. Revisa tu correo y prepárate.',
        canonical: 'https://bakano.ec/cita-confirmada',
        ogTitle: 'Cita Confirmada | Bakano',
        ogDescription: 'Tu cita con el equipo de Bakano está reservada. Te contactaremos pronto.',
        ogUrl: 'https://bakano.ec/cita-confirmada',
      } satisfies RouteMeta,
    },
    {
      path: '/sin-espacio',
      name: 'no-space',
      component: NoSpaceView,
      meta: {
        title: 'Sin Espacio Disponible | Bakano',
        description:
          'En este momento los cupos de asesoría de Bakano están completos. Te notificaremos cuando se libere un espacio.',
        canonical: 'https://bakano.ec/sin-espacio',
        ogTitle: 'Sin Espacio Disponible | Bakano',
        ogDescription:
          'Los cupos de asesoría están completos. Te avisaremos cuando haya disponibilidad.',
        ogUrl: 'https://bakano.ec/sin-espacio',
      } satisfies RouteMeta,
    },
    {
      path: '/politicas-privacidad',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
      meta: {
        title: 'Política de Privacidad | Bakano Ecuador',
        description:
          'Política de privacidad de Bakano. Información sobre el tratamiento de datos personales conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.',
        canonical: 'https://comunidad.bakano.ec/politicas-privacidad',
        ogTitle: 'Política de Privacidad | Bakano Ecuador',
        ogDescription: 'Política de privacidad de Bakano Ecuador.',
        ogUrl: 'https://comunidad.bakano.ec/politicas-privacidad',
      } satisfies RouteMeta,
    },
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: LegalNoticeView,
      meta: {
        title: 'Aviso Legal | Bakano Ecuador',
        description:
          'Aviso legal de Bakano Ecuador. Términos y condiciones de uso del sitio web bakano.ec.',
        canonical: 'https://comunidad.bakano.ec/aviso-legal',
        ogTitle: 'Aviso Legal | Bakano Ecuador',
        ogDescription: 'Aviso legal de Bakano Ecuador.',
        ogUrl: 'https://comunidad.bakano.ec/aviso-legal',
      } satisfies RouteMeta,
    },
    {
      path: '/calificar',
      name: 'calificar',
      component: CalificarView,
      meta: {
        title: 'Califica tu negocio | Bakano',
        description:
          'Descubre si tu negocio califica para una asesoría gratuita con Bakano. Completa el formulario y te asignamos al miembro del equipo ideal.',
        canonical: 'https://bakano.ec/calificar',
        ogTitle: 'Califica tu negocio | Bakano',
        ogDescription: 'Descubre si tu negocio califica para una asesoría gratuita.',
        ogUrl: 'https://bakano.ec/calificar',
      } satisfies RouteMeta,
    },
  ],
})

// ── SEO dinámico por ruta ──────────────────────────────────────────────────────
const setMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.name = name
    document.head.appendChild(el)
  }
  el.content = content
}

const setOgMeta = (property: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.content = content
}

const setCanonical = (href: string) => {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

router.afterEach((to) => {
  const meta = to.meta
  document.title = meta.title ?? 'Bakano'
  setMeta('description', meta.description ?? '')
  setOgMeta('og:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('og:description', meta.ogDescription ?? meta.description ?? '')
  setOgMeta('og:url', meta.ogUrl ?? '')
  setOgMeta('twitter:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('twitter:description', meta.ogDescription ?? meta.description ?? '')
  setCanonical(meta.canonical ?? '')
})

export default router
