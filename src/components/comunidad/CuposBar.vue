<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Cupos } from '@/composables/useCupos'

/**
 * Barra fija abajo con los cupos del mes y el CTA. Aparece cuando el hero ya quedó atrás
 * (ahí el CTA principal deja de estar a la vista) y se esconde si el modal está abierto.
 */
const props = defineProps<{ cupos: Cupos; oculta?: boolean }>()
const emit = defineEmits<{ (e: 'abrir'): void }>()

const visible = ref(false)
let pendiente = false

function medir() {
  visible.value = window.scrollY > window.innerHeight * 0.7
  pendiente = false
}
function onScroll() {
  if (pendiente) return
  pendiente = true
  requestAnimationFrame(medir)
}

onMounted(() => {
  medir()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="bar">
    <div v-if="visible && !props.oculta" class="bar" :class="`is-${cupos.urgencia}`">
      <div class="bar__txt">
        <strong>Quedan {{ cupos.restantes }} cupos</strong>
        <span>de {{ cupos.mes }} · cierra el {{ cupos.ultimoDia }}</span>
      </div>
      <button class="bar__cta" @click="emit('abrir')">
        Apartar mi cupo <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.7rem 1rem max(0.7rem, env(safe-area-inset-bottom));
  border-top: 1px solid rgba($BAKANO-PINK, 0.35);
  background: rgba($BAKANO-DARK, 0.92);
  backdrop-filter: blur(10px);
  color: $BAKANO-LIGHT;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &__txt {
    display: flex;
    min-width: 0;
    flex-direction: column;
    line-height: 1.25;
    strong {
      font-family: 'Outfit', sans-serif;
      font-size: 0.98rem;
    }
    span {
      color: rgba($BAKANO-LIGHT, 0.6);
      font-size: 0.76rem;
    }
  }

  &__cta {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.1rem;
    border: 0;
    border-radius: 999px;
    background: $BAKANO-PINK;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }

  &.is-alta strong {
    color: $BAKANO-PINK;
  }

  @media (min-width: 768px) {
    justify-content: center;
    gap: 2rem;
    &__txt {
      flex-direction: row;
      align-items: baseline;
      gap: 0.5rem;
    }
  }
}

.bar-enter-active,
.bar-leave-active {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}
.bar-enter-from,
.bar-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .bar-enter-active,
  .bar-leave-active {
    transition: none;
  }
}
</style>
