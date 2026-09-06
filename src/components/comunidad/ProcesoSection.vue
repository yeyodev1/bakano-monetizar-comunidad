<script setup lang="ts">
import { proceso } from '@/data/comunidad'
import ScrollCue from './ScrollCue.vue'
</script>

<template>
  <section id="proceso" class="proc">
    <h2 class="proc__h2">Cómo lo hacemos contigo</h2>
    <p class="proc__sub">
      Dejamos de improvisar. Cuatro pasos, en este orden, para que tu comunidad termine comprando.
    </p>

    <ol class="proc__pasos">
      <li v-for="(p, i) in proceso" :key="p.titulo" class="proc__paso">
        <span class="proc__num">{{ i + 1 }}</span>
        <i class="fa-solid proc__icono" :class="p.icono"></i>
        <h3>{{ p.titulo }}</h3>
        <p>{{ p.texto }}</p>
      </li>
    </ol>

    <ScrollCue destino="casos" etiqueta="Casos reales" />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/comunidad.scss' as r;

.proc {
  @include r.seccion;

  &__h2 {
    @include r.titulo;
  }
  &__sub {
    @include r.subtitulo;
  }

  &__pasos {
    display: flex;
    width: 100%;
    max-width: 980px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0 0;
    padding: 0;
    list-style: none;
    counter-reset: paso;
  }

  &__paso {
    position: relative;
    display: flex;
    flex: 1 1 220px;
    max-width: 300px;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.6rem 1.4rem 1.5rem;
    border: 1px solid rgba(#fff, 0.1);
    border-radius: 18px;
    background: rgba(#fff, 0.04);

    h3 {
      margin: 0.4rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.12rem;
      line-height: 1.25;
    }
    p {
      margin: 0;
      color: rgba($BAKANO-LIGHT, 0.75);
      font-size: 0.93rem;
      line-height: 1.55;
    }
  }

  &__num {
    position: absolute;
    top: 1rem;
    right: 1.1rem;
    color: rgba($BAKANO-LIGHT, 0.28);
    font-family: 'Outfit', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1;
  }

  &__icono {
    color: $BAKANO-PINK;
    font-size: 1.5rem;
  }
}
</style>
