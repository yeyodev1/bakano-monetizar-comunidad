<script setup lang="ts">
import type { Cupos } from '@/composables/useCupos'

/** Barra de cupos del mes: cuántos quedan, cuántos se fueron y cuándo cierra. */
defineProps<{ cupos: Cupos; compacto?: boolean }>()
</script>

<template>
  <div class="meter" :class="[`is-${cupos.urgencia}`, { 'meter--compacto': compacto }]">
    <div class="meter__cab">
      <strong>
        Quedan <em>{{ cupos.restantes }}</em> de {{ cupos.iniciales }} cupos
        <span>de {{ cupos.mes }}</span>
      </strong>
      <span class="meter__cierre">
        <i class="fa-regular fa-calendar"></i>
        Cierra el {{ cupos.ultimoDia }}
      </span>
    </div>
    <div
      class="meter__barra"
      role="progressbar"
      :aria-valuenow="cupos.ocupados"
      aria-valuemin="0"
      :aria-valuemax="cupos.iniciales"
      :aria-label="`${cupos.ocupados} de ${cupos.iniciales} cupos tomados`"
    >
      <span :style="{ width: `${(cupos.ocupados / cupos.iniciales) * 100}%` }"></span>
    </div>
    <p v-if="!compacto" class="meter__pie">
      {{ cupos.ocupados }} ya tomados.
      <template v-if="cupos.diasRestantes > 0">
        Cada día que pasa hay uno menos; el {{ cupos.ultimoDia }} queda el último.
      </template>
      <template v-else>Hoy es el último día: queda un solo cupo.</template>
    </p>
  </div>
</template>

<style scoped lang="scss">
.meter {
  display: flex;
  width: 100%;
  max-width: 460px;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba($BAKANO-PINK, 0.35);
  border-radius: 14px;
  background: rgba($BAKANO-PINK, 0.08);
  text-align: left;

  &__cab {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.3rem 1rem;

    strong {
      font-family: 'Outfit', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      em {
        color: $BAKANO-PINK;
        font-size: 1.35rem;
        font-style: normal;
      }
      span {
        color: rgba($BAKANO-LIGHT, 0.6);
        font-weight: 500;
      }
    }
  }

  &__cierre {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  &__barra {
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(#fff, 0.1);

    span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, $BAKANO-PURPLE, $BAKANO-PINK);
      transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
  }

  &__pie {
    margin: 0;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-size: 0.82rem;
    line-height: 1.5;
  }

  &.is-alta {
    border-color: rgba($BAKANO-PINK, 0.7);
    background: rgba($BAKANO-PINK, 0.14);
  }

  &--compacto {
    padding: 0.7rem 0.9rem;
    gap: 0.45rem;
  }
}
</style>
