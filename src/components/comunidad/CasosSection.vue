<script setup lang="ts">
import { casos } from '@/data/comunidad'
import ScrollCue from './ScrollCue.vue'
</script>

<template>
  <section id="casos" class="casos">
    <h2 class="casos__h2">No es el único caso</h2>
    <p class="casos__sub">
      Comunidades que ya tenían la atención. Les faltaba el proceso de venta.
    </p>

    <div class="casos__lista">
      <article v-for="c in casos" :key="c.nombre" class="casos__item">
        <a v-if="c.img && c.url" :href="c.url" target="_blank" rel="noopener" class="casos__img">
          <img :src="c.img" :alt="`Sitio web de ${c.nombre}`" loading="lazy" />
        </a>
        <a
          v-else-if="c.reel"
          :href="c.reel"
          target="_blank"
          rel="noopener"
          class="casos__img casos__img--reel"
          aria-label="Ver el reel de Scarlett en Instagram"
        >
          <i class="fa-brands fa-instagram"></i>
          <span>Ver el reel</span>
        </a>

        <div class="casos__info">
          <span class="casos__rol">{{ c.rol }}</span>
          <h3>{{ c.nombre }}</h3>
          <strong class="casos__resultado">
            <i class="fa-solid fa-arrow-trend-up"></i> {{ c.resultado }}
          </strong>
          <p>{{ c.texto }}</p>
          <a v-if="c.url" :href="c.url" target="_blank" rel="noopener" class="casos__link">
            Ver su sitio <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </article>
    </div>

    <ScrollCue destino="para-quien" etiqueta="¿Es para ti?" />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/comunidad.scss' as r;

.casos {
  background: rgba(#fff, 0.025);
  @include r.seccion;

  &__h2 {
    @include r.titulo;
  }
  &__sub {
    @include r.subtitulo;
  }

  &__lista {
    display: flex;
    width: 100%;
    max-width: 980px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__item {
    display: flex;
    flex: 1 1 300px;
    max-width: 460px;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(#fff, 0.1);
    border-radius: 14px;
    background: rgba(#fff, 0.04);
  }

  &__img {
    display: flex;
    width: 100%;
    aspect-ratio: 16 / 10;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: inherit;
    text-decoration: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }

    &--reel {
      flex-direction: column;
      gap: 0.6rem;
      background: linear-gradient(135deg, rgba($BAKANO-PINK, 0.35), rgba($BAKANO-PURPLE, 0.35));
      i {
        font-size: 2.6rem;
      }
      span {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.9rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.1rem 1.2rem 1.3rem;

    h3 {
      margin: 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
    }
    p {
      margin: 0.3rem 0 0;
      color: rgba($BAKANO-LIGHT, 0.75);
      font-size: 0.93rem;
      line-height: 1.55;
    }
  }

  &__rol {
    color: rgba($BAKANO-LIGHT, 0.5);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__resultado {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: $BAKANO-GREEN;
    font-size: 0.95rem;
  }

  &__link {
    align-self: flex-start;
    margin-top: 0.6rem;
    color: $BAKANO-PINK;
    font-size: 0.88rem;
    font-weight: 600;
    text-decoration: none;
    i {
      margin-left: 0.3rem;
      font-size: 0.78rem;
    }
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
