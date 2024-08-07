
import { useBusTransition } from './bus-transition'
import { useRouter, nextTick, useNuxtApp } from '#imports'

import { onMounted, onUnmounted } from "vue"

export const useTransition = () => {
  const route = {
    to: undefined,
    from: undefined,
  }
  const nuxtApp = useNuxtApp()
  const router = useRouter()
  const transitionBus = useBusTransition()

  nuxtApp.hook('page:start', () => {
    if (route.to === undefined && route.from === undefined) return
    // console.info("page:start")
    nextTick(() => {
      onLeave(route.to, route.from)
    })
  })
  nuxtApp.hook('page:finish', () => {
    // console.info("page:finish")
    onEnter(route.to, route.from)
  })

  const onLeave = (to, from) => {
    transitionBus.onLeave({
      done: () => {
        transitionBus.onLeaveDone(to, from)
      }, to, from
    })
  }

  const onEnter = (to, from) => {
    transitionBus.onEnter({
      done: () => {
        transitionBus.onEnterDone(to, from)
      }, to, from
    })
  }

  // Router events
  router.afterEach((to, from) => {
    route.to = to
    route.from = from
  })

  const unsubscribe = router.afterEach(() => { })

  onMounted(() => {
    onEnter(router.currentRoute.path, undefined)
  })
  onUnmounted(unsubscribe)
}
