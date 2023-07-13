import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'app-svg',
    configKey: 'appSvg'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)


    // Add components
    addComponent({
      name: 'AppSvg', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppSvg.vue')
    })
  }
})
