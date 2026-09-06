<script setup lang="ts">
/**
 * Cierra cada sección indicando qué viene después y llevando allá al hacer click.
 * Siempre visible a propósito: hace de divisor y de navegación, no sólo de pista de scroll.
 */
const props = defineProps<{ destino: string; etiqueta?: string }>()

const bajar = () =>
  document.getElementById(props.destino)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
</script>

<template>
  <button class="cue" :aria-label="`Ir a ${etiqueta ?? 'la siguiente sección'}`" @click="bajar">
    <span v-if="etiqueta" class="cue__txt">{{ etiqueta }}</span>
    <span class="cue__ring"><i class="fa-solid fa-chevron-down"></i></span>
  </button>
</template>

<style scoped lang="scss">
.cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  margin-top: 2.75rem;
  padding: 0;
  border: 0;
  background: none;
  color: rgba($BAKANO-LIGHT, 0.5);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $BAKANO-LIGHT;

    .cue__ring {
      border-color: rgba($BAKANO-PINK, 0.9);
      background: rgba($BAKANO-PINK, 0.18);
    }
  }

  &__txt {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  &__ring {
    display: flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba($BAKANO-PINK, 0.45);
    border-radius: 50%;
    background: rgba($BAKANO-PINK, 0.08);
    color: $BAKANO-PINK;
    font-size: 0.85rem;
    animation: cue-bob 2s ease-in-out infinite;
    transition:
      border-color 0.2s ease,
      background 0.2s ease;
  }
}

@keyframes cue-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cue {
    transition: none;
  }

  .cue__ring {
    animation: none;
  }
}
</style>
