import { defineNuxtModule, addImports, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'device',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)

    addImports({
      name: 'useDevice',
      as: 'useDevice',
      from: resolver.resolve('runtime/composables/device')
    })


  }
})
