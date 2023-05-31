import { defineNuxtModule, addImports, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'favicon',
    configKey: 'favicon'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup (options, nuxt) { // options, nuxt
    const resolver = createResolver(import.meta.url)

    nuxt.hook('build:before', () => {
      console.info(options)
    })

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
    /*
    addComponent({
      name: 'MyComponent', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/MyComponent.vue')
    })
    */

  }
})
