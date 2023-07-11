import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

export default defineNuxtModule({
  meta: {
    name: 'app-svg',
    configKey: 'appSvg'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup (options, nuxt) { // options, nuxt
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.appSvg = defu(nuxt.options.runtimeConfig.public.appSvg, {
      path: options?.path || '../../../../../assets/svg/'
    })

    // Add components
    addComponent({
      name: 'AppSvg', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppSvg.vue')
    })
  }
})
