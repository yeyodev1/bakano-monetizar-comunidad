<script setup lang="ts">
import { ref, computed } from 'vue'
import PhoneField from './PhoneField.vue'
import { trackStage, generateEventId } from '@/utils/ghl'
import { getStoredFbParams } from '@/utils/fbclid'
import { tamanos, ofertas, califica, etiquetaTamano, etiquetaOferta } from '@/data/comunidad'
import type { Cupos } from '@/composables/useCupos'

const props = defineProps<{ cupos: Cupos }>()
const emit = defineEmits<{ (e: 'enviado', nombre: string, tamano: string): void }>()

const form = ref({ nombre: '', apellido: '', telefono: '', usuario: '', tamano: '', oferta: '' })
const enviando = ref(false)
const error = ref('')

const valido = computed(
  () =>
    form.value.nombre.trim().length > 1 &&
    form.value.apellido.trim().length > 1 &&
    form.value.telefono !== '' &&
    form.value.usuario.trim().length > 1 &&
    form.value.tamano !== '' &&
    form.value.oferta !== '',
)

/** Guarda el @ sin la arroba ni la URL: solo el usuario. */
const limpiarUsuario = (u: string) =>
  u
    .trim()
    .replace(/^https?:\/\/(www\.)?(instagram|tiktok)\.com\//i, '')
    .replace(/^@+/, '')
    .replace(/\/.*$/, '')

async function enviar() {
  if (!valido.value || enviando.value) return
  enviando.value = true
  error.value = ''
  const event_id = generateEventId('lead')
  const tamano = form.value.tamano
  try {
    await trackStage('comunidad_lead', {
      event_id,
      nombre: form.value.nombre.trim(),
      apellido: form.value.apellido.trim(),
      telefono: form.value.telefono,
      usuario: limpiarUsuario(form.value.usuario),
      tamano,
      tamano_nombre: etiquetaTamano(tamano),
      oferta: form.value.oferta,
      oferta_nombre: etiquetaOferta(form.value.oferta),
      origen: 'landing-comunidad',
      mes: props.cupos.mes,
      cupos_restantes: String(props.cupos.restantes),
      ...getStoredFbParams(),
    })
    // Mismo eventID que el servidor manda a CAPI: así Meta deduplica browser vs server.
    ;(window as any).fbq?.(
      'track',
      califica(tamano) ? 'Lead' : 'Contact',
      {},
      { eventID: event_id },
    )
    emit('enviado', form.value.nombre.trim(), tamano)
  } catch {
    error.value = 'No se pudo enviar. Escríbenos por DM a @bakano.ec y te atendemos igual.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="cf">
    <div class="cf__enc">
      <h2>Aparta tu cupo de {{ cupos.mes }}</h2>
      <p class="cf__sub">
        <strong :class="`is-${cupos.urgencia}`">Quedan {{ cupos.restantes }}</strong> · Te
        escribimos por WhatsApp hoy mismo.
      </p>
    </div>

    <div class="cf__fila">
      <label>Tu nombre <input v-model="form.nombre" type="text" placeholder="Scarlett" /></label>
      <label>Tu apellido <input v-model="form.apellido" type="text" placeholder="Pérez" /></label>
    </div>

    <PhoneField v-model="form.telefono" />

    <label class="cf__campo">
      Tu usuario principal
      <input v-model="form.usuario" type="text" placeholder="@tucuenta" autocapitalize="none" />
    </label>

    <p class="cf__pregunta">¿De qué tamaño es tu comunidad?</p>
    <div class="cf__opciones cf__opciones--dos">
      <label v-for="t in tamanos" :key="t.id" :class="{ 'is-on': form.tamano === t.id }">
        <input v-model="form.tamano" type="radio" :value="t.id" />
        <i class="fa-solid" :class="t.icono"></i>
        <span>{{ t.texto }}</span>
      </label>
    </div>

    <p class="cf__pregunta">¿Qué quieres venderle?</p>
    <div class="cf__opciones">
      <label v-for="o in ofertas" :key="o.id" :class="{ 'is-on': form.oferta === o.id }">
        <input v-model="form.oferta" type="radio" :value="o.id" />
        <i class="fa-solid" :class="o.icono"></i>
        <span>{{ o.texto }}</span>
      </label>
    </div>

    <div class="cf__pie">
      <button class="cf__cta" :disabled="!valido || enviando" @click="enviar">
        <i v-if="enviando" class="fa-solid fa-spinner fa-spin"></i>
        {{ enviando ? 'Enviando…' : 'Apartar mi cupo' }}
      </button>

      <p v-if="error" class="cf__error">{{ error }}</p>
      <p class="cf__legal">Al enviar aceptas que te contactemos. Nada de spam.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/comunidad.scss' as r;

.cf {
  display: flex;
  flex-direction: column;

  // El encabezado se queda pegado arriba: al bajar dentro del modal, el titulo y
  // el subtitulo se iban de largo y la caja quedaba sin contexto.
  &__enc {
    position: sticky;
    top: 0;
    z-index: 1;
    margin: 0 calc(var(--cm-pad, 1.5rem) * -1);
    padding: 2rem calc(var(--cm-pad, 1.5rem) + 2.4rem) 0.7rem var(--cm-pad, 1.5rem);
    background: $BAKANO-DARK;

    &::after {
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      height: 1.4rem;
      background: linear-gradient(to bottom, $BAKANO-DARK, rgba($BAKANO-DARK, 0));
      content: '';
      pointer-events: none;
    }
  }

  h2 {
    margin: 0;
    font-family: 'Outfit', sans-serif;
    font-size: 1.55rem;
  }

  &__sub {
    margin: 0.45rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.62);
    font-size: 0.92rem;
    strong {
      color: $BAKANO-LIGHT;
      &.is-alta {
        color: $BAKANO-PINK;
      }
    }
  }

  &__fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    label {
      flex: 1 1 140px;
    }
  }

  &__fila label,
  &__campo {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 1.05rem;
    font-size: 0.86rem;
    font-weight: 600;
    span {
      color: rgba($BAKANO-LIGHT, 0.45);
      font-weight: 400;
    }
    input {
      min-width: 0;
      @include r.campo;
    }
  }

  &__pregunta {
    margin: 1.6rem 0 0.7rem;
    font-size: 0.86rem;
    font-weight: 600;
  }

  &__opciones {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 0.4rem;

    label {
      display: flex;
      flex: 1 1 100%;
      align-items: center;
      gap: 0.8rem;
      padding: 0.95rem 1rem;
      border: 1px solid rgba(#fff, 0.14);
      border-radius: 12px;
      background: rgba(#fff, 0.04);
      cursor: pointer;
      transition:
        border-color 0.16s ease,
        background 0.16s ease;

      &.is-on {
        border-color: $BAKANO-PINK;
        background: rgba($BAKANO-PINK, 0.14);
      }
      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      i {
        flex-shrink: 0;
        color: $BAKANO-PINK;
        font-size: 1.02rem;
      }
      span {
        font-size: 0.92rem;
        line-height: 1.3;
      }
    }

    // Los tamaños son cortos: caben dos por fila.
    &--dos label {
      flex: 1 1 calc(50% - 0.3rem);
    }
  }

  &__pie {
    position: sticky;
    bottom: 0;
    margin: 1.2rem calc(var(--cm-pad, 1.5rem) * -1) 0;
    padding: 0.9rem var(--cm-pad, 1.5rem) max(1rem, env(safe-area-inset-bottom));
    background: $BAKANO-DARK;

    &::before {
      position: absolute;
      top: -1.6rem;
      right: 0;
      left: 0;
      height: 1.6rem;
      background: linear-gradient(to bottom, rgba($BAKANO-DARK, 0), $BAKANO-DARK);
      content: '';
      pointer-events: none;
    }
  }

  &__cta {
    width: 100%;
    @include r.cta;
  }

  &__error {
    margin-top: 0.85rem;
    color: #ff8095;
    font-size: 0.86rem;
    text-align: center;
  }

  &__legal {
    margin: 0.7rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.42);
    font-size: 0.76rem;
    text-align: center;
  }

  @media (max-height: 760px) {
    &__enc {
      padding-top: 1.4rem;
      padding-bottom: 0.55rem;
    }
    h2 {
      font-size: 1.3rem;
    }
    &__sub {
      margin-top: 0.3rem;
    }
    &__fila label,
    &__campo {
      margin-top: 0.8rem;
    }
    &__pregunta {
      margin: 1.1rem 0 0.55rem;
    }
    &__opciones {
      gap: 0.45rem;
      label {
        padding: 0.72rem 0.9rem;
      }
    }
    &__legal {
      margin-top: 0.5rem;
    }
  }
}
</style>
