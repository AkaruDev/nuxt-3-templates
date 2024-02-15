import { defineNuxtModule, addComponent, createResolver, addImports } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'corgi',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)


    // Exemples
    // Add composables
    addImports({
      name: 'useCorgi',
      as: 'useCorgi',
      from: resolver.resolve('runtime/composables/corgi')
    })
    addImports({
      name: 'useScene',
      as: 'useScene',
      from: resolver.resolve('runtime/composables/scene')
    })
    addImports({
      name: 'useRenderer',
      as: 'useRenderer',
      from: resolver.resolve('runtime/composables/renderer')
    })
    addImports({
      name: 'useCamera',
      as: 'useCamera',
      from: resolver.resolve('runtime/composables/camera')
    })

    // Add components
    addComponent({
      name: 'CorgiCanvas', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/CorgiCanvas.vue')
    })

  }
})
