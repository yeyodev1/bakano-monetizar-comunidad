import { computed, ref, onMounted, onUnmounted } from 'vue'

/**
 * Cupos mensuales de la campaña.
 *
 * No hay stock real detrás: es una mecánica de urgencia que Bakano decidió para la landing.
 * La regla es determinista, así cualquier persona que entre el mismo día ve el mismo número:
 *
 *   día 1 del mes → CUPOS_INICIALES · último día del mes → 1 · entre medio, lineal.
 *
 * Al cambiar de mes vuelve a CUPOS_INICIALES sola. Se calcula con la hora del navegador.
 */
export const CUPOS_INICIALES = 20

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export interface Cupos {
  /** Cupos que quedan hoy (1..CUPOS_INICIALES). */
  restantes: number
  /** Cupos ya tomados: lo que se pinta en la barra. */
  ocupados: number
  iniciales: number
  dia: number
  diasDelMes: number
  /** Días que faltan para que cierre el mes, sin contar hoy. */
  diasRestantes: number
  /** Último día del mes, en número: "se cierra el 30". */
  ultimoDia: number
  mes: string
  mesSiguiente: string
  /** Aviso corto para pintar junto al número. */
  urgencia: 'alta' | 'media' | 'baja'
}

export function calcularCupos(fecha = new Date(), iniciales = CUPOS_INICIALES): Cupos {
  const dia = fecha.getDate()
  const diasDelMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate()
  const avance = diasDelMes > 1 ? (dia - 1) / (diasDelMes - 1) : 0
  const crudo = Math.round(iniciales - (iniciales - 1) * avance)
  const restantes = Math.max(1, Math.min(iniciales, crudo))

  return {
    restantes,
    ocupados: iniciales - restantes,
    iniciales,
    dia,
    diasDelMes,
    diasRestantes: diasDelMes - dia,
    ultimoDia: diasDelMes,
    mes: MESES[fecha.getMonth()],
    mesSiguiente: MESES[(fecha.getMonth() + 1) % 12],
    urgencia: restantes <= 5 ? 'alta' : restantes <= 10 ? 'media' : 'baja',
  }
}

/** Reactivo: si la pestaña queda abierta y cambia el día, el número se actualiza solo. */
export function useCupos() {
  const ahora = ref(new Date())
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => {
      const hoy = new Date()
      if (hoy.getDate() !== ahora.value.getDate()) ahora.value = hoy
    }, 60_000)
  })
  onUnmounted(() => clearInterval(timer))

  return computed(() => calcularCupos(ahora.value))
}
