import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'app-link',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)

    // Add components
    addComponent({
      name: 'AppLink', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppLink.vue')
    })
    addComponent({
      name: 'AppButton', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppButton.vue')
    })

  }
})
