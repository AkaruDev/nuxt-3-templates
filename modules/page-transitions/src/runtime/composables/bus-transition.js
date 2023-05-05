
import { useEventBus } from '@vueuse/core'

export const useBusTransition = (() => {
  const bus = useEventBus('page-transition')

  const callbacks = {}
  const onEmit = (event, payload) => {
    callbacks?.[event]?.forEach(callback => callback?.(payload))
  }
  bus.on(onEmit)

  const on = (event, callback) => {
    callbacks[event] = callbacks[event] || []
    if (!callbacks[event].includes(callback)) {
      callbacks[event].push(callback)
    }
  }

  const off = (event, callback) => {
    if (callbacks?.[event]?.includes(callback)) {
      callbacks[event] = callbacks[event].filter(entry => entry !== callback)
    }
  }

  const onEnter = (route) => {
    bus.emit('transition:enter', route)
  }

  const onEnterDone = (route) => {
    bus.emit('transition:enter:done', route)
  }

  const onLeave = (route) => {
    bus.emit('transition:leave', route)
  }

  const onLeaveDone = (route) => {
    bus.emit('transition:leave:done', route)
  }

  const instance = { on, off, onEnter, onLeave, onEnterDone, onLeaveDone }

  return () => instance
})()
