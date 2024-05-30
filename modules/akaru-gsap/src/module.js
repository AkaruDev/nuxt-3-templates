import { defineNuxtModule, addPlugin, addImports, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'akaru-gsap',
    configKey: 'akaru-gsap'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const { resolve } = createResolver(import.meta.url)

    addPlugin(resolve('runtime/plugins/index.js'))
    // Add composables
    addImports({
      name: 'useTimeline',
      as: 'useTimeline',
      from: resolve('runtime/composables/timeline')
    })


  }
})
