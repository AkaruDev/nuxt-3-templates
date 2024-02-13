import { defineNuxtPlugin } from '#app'
import { useSmoothScroll } from './composables/smooth-scroll'
import container from './directives/container'
import sticky from './directives/sticky'


export default defineNuxtPlugin(nuxtApp => {
  // const createSmoothScroll = createApp(App)

  // now available on `nuxtApp.$injected`
  const smoothScroll = useSmoothScroll()
  nuxtApp.provide('smoothScroll', smoothScroll)

  nuxtApp.hook('app:created', () => {
    smoothScroll.init()
  })

  nuxtApp.vueApp.directive('scroll-container', container(nuxtApp))
  nuxtApp.vueApp.directive('scroll-sticky', sticky(nuxtApp))
})
