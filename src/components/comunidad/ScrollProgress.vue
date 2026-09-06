<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/** Barra fina de progreso de lectura. Hila las secciones y da sensación de recorrido. */
const avance = ref(0)
let pendiente = false

function medir() {
  const alto = document.documentElement.scrollHeight - window.innerHeight
  avance.value = alto > 0 ? Math.min(1, window.scrollY / alto) : 0
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
  window.addEventListener('resize', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div class="prog" aria-hidden="true">
    <div class="prog__bar" :style="{ transform: `scaleX(${avance})` }"></div>
  </div>
</template>

<style scoped lang="scss">
.prog {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 80;
  width: 100%;
  height: 3px;
  background: rgba(#fff, 0.06);

  &__bar {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, $BAKANO-PINK, $BAKANO-PURPLE);
    transform: scaleX(0);
    transform-origin: 0 50%;
    will-change: transform;
  }
}
</style>
