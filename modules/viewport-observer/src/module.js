import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { defu } from "defu"

export default defineNuxtModule({
  meta: {
    name: 'viewport-observer',
    configKey: 'viewportObserver'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup (options, nuxt) { // options, nuxt
    const resolver = createResolver(import.meta.url)
    nuxt.options.runtimeConfig.public.viewportObserver = defu(options, {
      active: true
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('runtime/plugin'))


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
