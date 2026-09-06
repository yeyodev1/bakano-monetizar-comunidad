<script setup lang="ts">
import { ref, computed } from 'vue'
import { parsePhoneNumberFromString, AsYouType, type CountryCode } from 'libphonenumber-js'
import CountryPicker from './CountryPicker.vue'
import { paisPorDefecto, type Pais } from '@/data/paises'

/** Emite el número en E.164 ('' mientras no sea válido, para que el submit siga bloqueado). */
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const pais = ref<Pais>(paisPorDefecto)
const numero = ref('')
const tocado = ref(false)

/** Sólo dígitos, con el prefijo del país al frente. libphonenumber quita el 0 nacional. */
const internacional = computed(() => pais.value.dial + numero.value.replace(/\D/g, ''))

const parseado = computed(() =>
  parsePhoneNumberFromString(internacional.value, pais.value.code as CountryCode),
)

const valido = computed(() => parseado.value?.isValid() ?? false)

const formateado = computed(() =>
  numero.value ? new AsYouType(pais.value.code as CountryCode).input(numero.value) : '',
)

const avisar = () => emit('update:modelValue', valido.value ? (parseado.value?.number ?? '') : '')

function onInput(e: Event) {
  numero.value = (e.target as HTMLInputElement).value.replace(/[^\d\s\-()]/g, '')
  avisar()
}

function cambiarPais(p: Pais) {
  pais.value = p
  avisar()
}
</script>

<template>
  <div class="tel">
    <label class="tel__label">WhatsApp</label>

    <div class="tel__wrap" :class="{ 'is-bad': tocado && numero && !valido }">
      <CountryPicker :pais="pais" @elegir="cambiarPais" />

      <input
        class="tel__input"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        placeholder="098 493 4039"
        :value="formateado"
        @input="onInput"
        @blur="tocado = true"
      />

      <i v-if="valido" class="fa-solid fa-circle-check tel__ok"></i>
    </div>

    <span v-if="tocado && numero && !valido" class="tel__error">
      Número inválido para {{ pais.name }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.tel {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1.05rem;

  &__label {
    font-size: 0.86rem;
    font-weight: 600;
  }

  &__wrap {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid rgba(#fff, 0.16);
    border-radius: 11px;
    background: rgba(#fff, 0.05);

    &:focus-within {
      border-color: $BAKANO-PINK;
    }
    &.is-bad {
      border-color: #ff8095;
    }
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: 0.9rem 0.5rem 0.9rem 0;
    border: 0;
    background: none;
    color: $BAKANO-LIGHT;
    font-family: inherit;
    font-size: 1rem;

    &:focus {
      outline: none;
    }
    &::placeholder {
      color: rgba($BAKANO-LIGHT, 0.32);
    }
  }

  &__ok {
    padding-right: 0.9rem;
    color: $BAKANO-GREEN;
    font-size: 0.95rem;
  }

  &__error {
    color: #ff8095;
    font-size: 0.8rem;
  }
}
</style>
