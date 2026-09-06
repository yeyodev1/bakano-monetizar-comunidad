<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { paises, SEPARADOR, type Pais } from '@/data/paises'

defineProps<{ pais: Pais }>()
const emit = defineEmits<{ (e: 'elegir', p: Pais): void }>()

const abierto = ref(false)
const busqueda = ref('')
const raiz = ref<HTMLElement | null>(null)

const filtrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return paises
  return paises.filter(
    (c) => c.code !== SEPARADOR && (c.name.toLowerCase().includes(q) || c.dial.includes(q)),
  )
})

function elegir(c: Pais) {
  if (c.code === SEPARADOR) return
  emit('elegir', c)
  abierto.value = false
  busqueda.value = ''
}

const fueraClick = (e: MouseEvent) => {
  if (abierto.value && raiz.value && !raiz.value.contains(e.target as Node)) abierto.value = false
}

onMounted(() => document.addEventListener('click', fueraClick))
onUnmounted(() => document.removeEventListener('click', fueraClick))
</script>

<template>
  <div ref="raiz" class="cp">
    <button type="button" class="cp__trigger" :aria-expanded="abierto" @click="abierto = !abierto">
      <span class="cp__flag">{{ pais.flag }}</span>
      <span class="cp__dial">{{ pais.dial }}</span>
      <i class="fa-solid fa-chevron-down cp__chevron" :class="{ open: abierto }"></i>
    </button>

    <Transition name="drop">
      <div v-if="abierto" class="cp__drop" role="listbox">
        <input v-model="busqueda" class="cp__buscar" type="text" placeholder="Buscar país…" />
        <ul>
          <li
            v-for="c in filtrados"
            :key="c.code"
            :class="{ sep: c.code === SEPARADOR, on: c.code === pais.code }"
            role="option"
            :aria-selected="c.code === pais.code"
            @click="elegir(c)"
          >
            <template v-if="c.code !== SEPARADOR">
              <span class="cp__flag">{{ c.flag }}</span>
              <span class="cp__nombre">{{ c.name }}</span>
              <span class="cp__dial">{{ c.dial }}</span>
            </template>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/comunidad.scss' as r;

.cp {
  position: relative;
  flex-shrink: 0;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.9rem 0.5rem 0.9rem 0.85rem;
    border: 0;
    border-right: 1px solid rgba(#fff, 0.14);
    background: none;
    color: $BAKANO-LIGHT;
    font-family: inherit;
    font-size: 0.95rem;
    cursor: pointer;
  }

  &__flag {
    font-size: 1.15rem;
    line-height: 1;
  }

  &__dial {
    color: rgba($BAKANO-LIGHT, 0.75);
    font-size: 0.9rem;
  }

  &__chevron {
    color: rgba($BAKANO-LIGHT, 0.5);
    font-size: 0.7rem;
    transition: transform 0.18s ease;
    &.open {
      transform: rotate(180deg);
    }
  }

  &__drop {
    position: absolute;
    top: calc(100% + 0.75rem);
    left: 0;
    z-index: 20;
    display: flex;
    width: 290px;
    max-height: 260px;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(#fff, 0.16);
    border-radius: 12px;
    background: #241d33;
    box-shadow: 0 18px 40px rgba(#000, 0.5);

    // Scrollbar oscura propia: el dropdown puede abrirse antes de que la vista monte el tema.
    ul {
      flex: 1;
      margin: 0;
      padding: 0.3rem;
      overflow-y: auto;
      list-style: none;
      scrollbar-width: thin;
      scrollbar-color: rgba($BAKANO-LIGHT, 0.28) transparent;

      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border: 2px solid transparent;
        border-radius: 999px;
        background-clip: padding-box;
        background-color: rgba($BAKANO-LIGHT, 0.26);
        &:hover {
          background-color: rgba($BAKANO-LIGHT, 0.42);
        }
      }
    }

    li {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.7rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      &:hover {
        background: rgba(#fff, 0.08);
      }
      &.on {
        background: rgba($BAKANO-PINK, 0.2);
      }
      &.sep {
        height: 1px;
        margin: 0.3rem 0;
        padding: 0;
        background: rgba(#fff, 0.12);
        pointer-events: none;
      }
    }
  }

  &__buscar {
    margin: 0.4rem;
    border-radius: 8px;
    font-size: 0.9rem;
    @include r.campo;
  }

  &__nombre {
    flex: 1;
  }
}

.drop-enter-active,
.drop-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .drop-enter-active,
  .drop-leave-active {
    transition: none;
  }
  .cp__chevron {
    transition: none;
  }
}
</style>
