<script setup lang="ts">
import { requisitos } from '@/data/comunidad'
import type { Cupos } from '@/composables/useCupos'
import ScrollCue from './ScrollCue.vue'

defineProps<{ cupos: Cupos }>()
</script>

<template>
  <section id="para-quien" class="pq">
    <h2 class="pq__h2">¿Es para ti?</h2>
    <p class="pq__sub">
      Abrimos {{ cupos.iniciales }} cupos al mes y en {{ cupos.mes }} quedan {{ cupos.restantes }}.
      Esto es lo que buscamos en cada uno.
    </p>

    <ul class="pq__lista">
      <li v-for="r in requisitos" :key="r.titulo" class="pq__item">
        <i class="fa-solid" :class="r.icono"></i>
        <div>
          <h3>{{ r.titulo }}</h3>
          <p>{{ r.texto }}</p>
        </div>
      </li>
    </ul>

    <p class="pq__nota">
      <i class="fa-solid fa-circle-info"></i>
      No vendemos pauta ni trucos de algoritmo. Si lo que te falta es estructura, hablemos.
    </p>

    <ScrollCue destino="contacto" etiqueta="Apartar mi cupo" />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/comunidad.scss' as r;

.pq {
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
    max-width: 560px;
    flex-direction: column;
    gap: 0.9rem;
    margin: 2rem 0 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.1rem 1.2rem;
    border: 1px solid rgba(#fff, 0.09);
    border-radius: 12px;
    background: rgba(#fff, 0.03);

    > i {
      display: flex;
      width: 38px;
      height: 38px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba($BAKANO-GREEN, 0.14);
      color: $BAKANO-GREEN;
      font-size: 0.95rem;
    }
    h3 {
      margin: 0.25rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.05rem;
      line-height: 1.25;
    }
    p {
      margin: 0.3rem 0 0;
      color: rgba($BAKANO-LIGHT, 0.75);
      font-size: 0.93rem;
      line-height: 1.55;
    }
  }

  &__nota {
    display: flex;
    max-width: 48ch;
    align-items: flex-start;
    gap: 0.6rem;
    margin: 1.75rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-size: 0.9rem;
    line-height: 1.55;
    i {
      margin-top: 0.2rem;
      color: $BAKANO-PINK;
    }
  }
}
</style>
