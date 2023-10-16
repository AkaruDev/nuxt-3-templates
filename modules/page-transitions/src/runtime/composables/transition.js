
import { usePreloader } from './preloader'
import { useBusTransition } from './bus-transition'

export const useTransition = (() => {
  const route = {
    from: null,
    to: null
  }

  const preloader = usePreloader()
  const busTransition = useBusTransition()

  const transition = {
    css: false,
    name: 'page',
    mode: 'out-in',
    onEnter: (el, done) => {
      const transitionBus = useBusTransition()
      transitionBus.onEnter({
        el, done: () => {
          transitionBus.onEnterDone(route)
          done()
        }, ...route
      })
    },
    onLeave: (el, done) => {
      const transitionBus = useBusTransition()
      transitionBus.onLeave({
        el, done: () => {
          transitionBus.onLeaveDone(route)
          done()
        }, ...route
      })
    }
  }

  const instance = {
    busTransition,
    preloader,
    pageTransition: transition,
    layoutTransition: transition,
    middleware (to, from) {
      route.to = to
      route.from = from
    }

  }

  return () => instance
})()
