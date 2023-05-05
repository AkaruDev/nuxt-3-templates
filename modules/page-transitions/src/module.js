import { defineNuxtModule, addImports, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'page-transitions',
    configKey: 'pageTransitions'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)

    // Add composables
    addImports({
      name: 'useTransition',
      as: 'useTransition',
      from: resolver.resolve('runtime/composables/transition')
    })

    // Add components
    addComponent({
      name: 'PageLoader', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/PageLoader.vue')
    })
    addComponent({
      name: 'PageTransition', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/PageTransition.vue')
    })
  }
})
