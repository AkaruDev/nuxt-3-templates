import { defineEmits } from '#app'

const EVENT_CHANGE = 'change'
const EVENT_PRESS = 'press'
const EVENT_READY = 'ready'
const EVENT_RELEASE = 'release'

export const useSlidesEvents = () => {
  const emit = defineEmits(['ready', 'change', 'press', 'release'])

  const change = (data) => {
    emit(EVENT_CHANGE, data)
  }
  const press = (data) => {
    emit(EVENT_PRESS, data)
  }
  const ready = (data) => {
    emit(EVENT_READY, data)
  }
  const release = (data) => {
    emit(EVENT_RELEASE, data)
  }

  return { change, press, ready, release }
}
