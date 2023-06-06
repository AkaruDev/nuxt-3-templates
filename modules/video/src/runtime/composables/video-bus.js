
import { useEventBus } from '@vueuse/core'

export const useVideoBus = () => {
  const bus = useEventBus('video')


  const events = {
    pause: 'progress',
    play: 'play',
    progress: 'progress',
    show: 'show',
  }

  const callbacks = {}
  const onEmit = (event, payload) => {
    if (!events[event]) return
    callbacks?.[event]?.forEach(callback => callback?.(payload))
  }
  bus.on(onEmit)

  /**
   * Add event callback from diffusion list
   * @param {String} event
   * @param {Function} callback
   */
  const on = (event, callback) => {
    if (!events[event]) return
    callbacks[event] = callbacks[event] || []
    if (!callbacks[event].includes(callback)) {
      callbacks[event].push(callback)
    }
  }

  /**
   * Remove event callback from diffusion list
   * @param {String} event
   * @param {Function} callback
   */
  const off = (event, callback) => {
    if (!events[event]) return
    if (callbacks?.[event]?.includes(callback)) {
      callbacks[event] = callbacks[event].filter(entry => entry !== callback)
    }
  }

  return { bus, on, off, events }
}
