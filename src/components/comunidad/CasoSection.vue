<script setup lang="ts">
import { historia, REEL_CODE } from '@/data/comunidad'
import ScrollCue from './ScrollCue.vue'
</script>

<template>
  <section id="caso" class="caso">
    <h2 class="caso__h2">Lo que hicimos con Scarlett</h2>
    <p class="caso__sub">
      Tenía una comunidad grande y no la monetizaba. Así fue el proceso, en el orden en que pasó.
    </p>

    <div class="caso__cuerpo">
      <div class="caso__timeline">
        <article v-for="h in historia" :key="h.titulo" class="caso__hito">
          <i class="fa-solid" :class="h.icono"></i>
          <div>
            <span class="caso__fecha">{{ h.fecha }}</span>
            <h3>{{ h.titulo }}</h3>
            <p>{{ h.texto }}</p>
          </div>
        </article>
      </div>

      <figure class="caso__reel">
        <iframe
          :src="`https://www.instagram.com/reel/${REEL_CODE}/embed/`"
          title="Scarlett cuenta cómo monetizó su comunidad con Bakano"
          loading="lazy"
          allowtransparency="true"
          allowfullscreen
          scrolling="no"
        ></iframe>
        <figcaption>Scarlett lo cuenta en el reel</figcaption>
      </figure>
    </div>

    <p class="caso__cierre">
      <strong>El problema nunca fue el algoritmo ni la pauta.</strong> Tampoco su servicio, ni ella
      como creadora, ni su comunidad. Lo que faltaba era estructura y empaquetar bien lo que tenía
      que vender.
    </p>

    <ScrollCue destino="proceso" etiqueta="Cómo lo hacemos" />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/comunidad.scss' as r;

.caso {
  background: rgba(#fff, 0.025);
  @include r.seccion;

  &__h2 {
    @include r.titulo;
  }
  &__sub {
    @include r.subtitulo;
  }

  &__cuerpo {
    display: flex;
    width: 100%;
    max-width: 1040px;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;

    @media (min-width: 900px) {
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 3rem;
    }
  }

  &__timeline {
    display: flex;
    width: 100%;
    max-width: 560px;
    flex-direction: column;
    gap: 1rem;
  }

  &__hito {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.1rem 1.2rem;
    border: 1px solid rgba(#fff, 0.09);
    border-left: 3px solid $BAKANO-PINK;
    border-radius: 12px;
    background: rgba(#fff, 0.03);

    > i {
      flex-shrink: 0;
      margin-top: 0.35rem;
      color: $BAKANO-PINK;
      font-size: 1.05rem;
    }
    h3 {
      margin: 0.3rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.08rem;
      line-height: 1.25;
    }
    p {
      margin: 0.35rem 0 0;
      font-size: 0.96rem;
      line-height: 1.55;
      color: rgba($BAKANO-LIGHT, 0.8);
    }
  }

  &__fecha {
    color: rgba($BAKANO-LIGHT, 0.45);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__reel {
    display: flex;
    width: 100%;
    max-width: 330px;
    flex-shrink: 0;
    flex-direction: column;
    gap: 0.6rem;
    margin: 0;

    iframe {
      width: 100%;
      height: 560px;
      border: 1px solid rgba(#fff, 0.1);
      border-radius: 14px;
      background: #fff;
    }

    figcaption {
      color: rgba($BAKANO-LIGHT, 0.6);
      font-size: 0.84rem;
      text-align: center;
    }
  }

  &__cierre {
    max-width: 48ch;
    margin: 2rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.78);
    font-size: 1rem;
    line-height: 1.65;
    text-align: center;
    strong {
      color: $BAKANO-LIGHT;
    }
  }
}
</style>
