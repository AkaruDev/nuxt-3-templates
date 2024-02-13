import { defineNuxtModule, addPlugin, addComponent, addImports, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition

export default defineNuxtModule({
  meta: {
    name: 'lenis-smooth-scroll',
    configKey: 'lenisSmoothScroll'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () {// (options, nuxt)
    const resolver = createResolver(import.meta.url)

    // Add composable
    addImports({
      name: 'useSmoothScroll',
      as: 'useSmoothScroll',
      from: resolver.resolve('runtime/composables/smooth-scroll')
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('runtime/plugin'))

    // Add components
    addComponent({
      name: 'CustomScrollBar', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/CustomScrollBar.vue')
    })
  }
})
