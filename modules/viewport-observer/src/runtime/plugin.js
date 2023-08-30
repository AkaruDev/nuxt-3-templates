import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { ref } from 'vue'
import observe from './directives/observe'

export default defineNuxtPlugin(nuxtApp => {

  const options = useRuntimeConfig().public.viewportObserver
  const active = ref(options.active)

  nuxtApp.provide('viewportObserver', { active })

  nuxtApp.vueApp.directive('observe', observe(nuxtApp))
})
