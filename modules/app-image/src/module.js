import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'my-feature',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)


    // Exemples
    // Add composables
    /*
    addImports({
      name: 'useMyComposable',
      as: 'useMyComposable',
      from: resolver.resolve('runtime/composables/my-composable')
    })
    */

    // Add components
    addComponent({
      name: 'AppImage', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppImage.vue')
    })

  }
})
