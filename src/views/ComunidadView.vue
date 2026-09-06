<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CasoSection from '@/components/comunidad/CasoSection.vue'
import ProcesoSection from '@/components/comunidad/ProcesoSection.vue'
import CasosSection from '@/components/comunidad/CasosSection.vue'
import ParaQuienSection from '@/components/comunidad/ParaQuienSection.vue'
import DiagnosticoModal from '@/components/comunidad/DiagnosticoModal.vue'
import ScrollCue from '@/components/comunidad/ScrollCue.vue'
import ScrollProgress from '@/components/comunidad/ScrollProgress.vue'
import { trackStage } from '@/utils/ghl'
import { captureFbParams } from '@/utils/fbclid'
import { MINIMO_SEGUIDORES, REEL_URL } from '@/data/comunidad'
import logo from '@/assets/logos/bakano-light.png'

const modalAbierto = ref(false)
const abrir = () => (modalAbierto.value = true)

/** Entrada del hero + reveals por scroll. Se salta entero si el usuario pidió menos movimiento. */
function animar() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.registerPlugin(ScrollTrigger)

  gsap
    .timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })
    .from('.lp__logo', { y: -16, opacity: 0 })
    .from('.lp__badge', { y: 12, opacity: 0 }, '-=0.45')
    .from('.lp__title', { y: 26, opacity: 0, duration: 0.85 }, '-=0.4')
    .from('.lp__lead', { y: 20, opacity: 0 }, '-=0.55')
    .from('.lp__hero .lp__cta', { y: 18, opacity: 0, scale: 0.96 }, '-=0.5')
    .from('.lp__nota', { opacity: 0 }, '-=0.35')

  const reveal = (sel: string) =>
    gsap.utils.toArray<HTMLElement>(sel).forEach((el) => {
      gsap.from(el, {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })

  reveal('.caso__h2, .caso__sub, .caso__hito, .caso__reel, .caso__cierre')
  reveal('.proc__h2, .proc__sub, .proc__paso')
  reveal('.casos__h2, .casos__sub, .casos__item')
  reveal('.pq__h2, .pq__sub, .pq__item, .pq__nota')
  reveal('.lp__contacto > *')
}

onMounted(async () => {
  // Tema oscuro a nivel documento: scrollbars nativas oscuras y sin flash blanco al overscroll.
  document.documentElement.classList.add('theme-dark')
  captureFbParams()
  trackStage('comunidad_view', {})
  await nextTick()
  animar()
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('theme-dark')
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <main class="lp">
    <ScrollProgress />

    <section class="lp__hero">
      <img :src="logo" alt="Bakano" class="lp__logo" />
      <span class="lp__badge">
        <i class="fa-solid fa-users"></i> Para creadores con más de {{ MINIMO_SEGUIDORES }}
      </span>
      <h1 class="lp__title">
        Tienes una comunidad grande.<br />
        <em>Pero no factura.</em>
      </h1>
      <p class="lp__lead">
        Ya tienes la atención de tu audiencia. Lo que falta no es pauta ni algoritmo: es
        <strong>estructura</strong>. Empaquetamos lo que sabes hacer, levantamos tu web y conectamos
        tus redes con un proceso de ventas. Con Scarlett funcionó desde el minuto uno:
        <strong>$1,000 el día del lanzamiento</strong>.
      </p>
      <button class="lp__cta" @click="abrir">
        Quiero monetizar mi comunidad <i class="fa-solid fa-arrow-right"></i>
      </button>
      <p class="lp__nota">Sin pauta obligatoria. Sin fórmulas mágicas. Estructura y ejecución.</p>

      <ScrollCue destino="caso" etiqueta="El caso de Scarlett" />
    </section>

    <CasoSection />
    <ProcesoSection />
    <CasosSection />
    <ParaQuienSection />

    <section id="contacto" class="lp__contacto">
      <h2 class="lp__h2">Deja de improvisar con tu comunidad</h2>
      <p class="lp__sub">
        Cuéntanos de tu comunidad y qué quieres venderle. Te escribimos por WhatsApp para agendar un
        diagnóstico.
      </p>
      <button class="lp__cta" @click="abrir">
        Quiero mi diagnóstico <i class="fa-solid fa-arrow-right"></i>
      </button>
      <a class="lp__reel" :href="REEL_URL" target="_blank" rel="noopener">
        ¿Todavía no viste el reel? Míralo y déjanos un like
        <i class="fa-brands fa-instagram"></i>
      </a>
    </section>

    <footer class="lp__footer">
      <img :src="logo" alt="Bakano" />
      <p>Bakano · Agencia de Performance Marketing · Guayaquil, Ecuador</p>
      <nav>
        <RouterLink to="/politicas-privacidad">Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso legal</RouterLink>
      </nav>
    </footer>

    <DiagnosticoModal :abierto="modalAbierto" @cerrar="modalAbierto = false" />
  </main>
</template>

<style scoped lang="scss">
@use '@/styles/comunidad.scss' as r;

.lp {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: $BAKANO-DARK;
  color: $BAKANO-LIGHT;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &__hero,
  &__contacto {
    @include r.seccion;
  }
  &__hero {
    padding-top: 2.5rem;
    text-align: center;
  }

  &__contacto {
    background: rgba($BAKANO-PINK, 0.07);
  }

  &__logo {
    width: 118px;
    margin-bottom: 1.5rem;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 1rem;
    border: 1px solid rgba($BAKANO-PINK, 0.5);
    border-radius: 999px;
    background: rgba($BAKANO-PINK, 0.12);
    color: $BAKANO-PINK;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__title {
    margin: 1.25rem 0 0;
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2rem, 8.5vw, 3.4rem);
    font-weight: 800;
    line-height: 1.12;
    em {
      color: $BAKANO-PINK;
      font-style: normal;
    }
  }

  &__lead {
    max-width: 50ch;
    margin: 1.25rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.78);
    font-size: 1rem;
    line-height: 1.65;
    strong {
      color: $BAKANO-LIGHT;
    }
    @media (min-width: 768px) {
      font-size: 1.08rem;
    }
  }

  &__h2 {
    @include r.titulo;
  }
  &__sub {
    @include r.subtitulo;
  }
  &__cta {
    margin-top: 1.75rem;
    @include r.cta;
  }

  &__nota {
    margin-top: 1.5rem;
    color: rgba($BAKANO-LIGHT, 0.5);
    font-size: 0.88rem;
    font-style: italic;
  }

  &__reel {
    margin-top: 1.5rem;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-size: 0.88rem;
    text-align: center;
    text-decoration: none;
    i {
      margin-left: 0.3rem;
      color: $BAKANO-PINK;
    }
    &:hover {
      color: $BAKANO-LIGHT;
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 2.5rem 1.5rem 3rem;
    border-top: 1px solid rgba(#fff, 0.08);
    text-align: center;
    img {
      width: 92px;
      opacity: 0.75;
    }
    p {
      margin: 0;
      color: rgba($BAKANO-LIGHT, 0.45);
      font-size: 0.82rem;
    }
    nav {
      display: flex;
      gap: 1.25rem;
    }
    a {
      color: rgba($BAKANO-LIGHT, 0.55);
      font-size: 0.82rem;
      text-decoration: none;
      &:hover {
        color: $BAKANO-PINK;
      }
    }
  }
}
</style>
