import { defineNuxtModule, createResolver, addImports } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'metas',
    configKey: 'metas'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)

    // Add composable
    addImports({
      name: 'useMetas',
      as: 'useMetas',
      from: resolver.resolve('runtime/composables/metas')
    })

  }
})
