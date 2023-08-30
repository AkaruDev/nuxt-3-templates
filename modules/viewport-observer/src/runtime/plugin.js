import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { ref } from 'vue'

export default defineNuxtPlugin(nuxtApp => {

  const options = useRuntimeConfig().public.viewportObserver
  const active = ref(options.active)

  nuxtApp.provide('viewportObserver', { active })
})
