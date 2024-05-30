import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'appform',
    configKey: 'appform'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const { resolve } = createResolver(import.meta.url)

    // Add components
    addComponent({
      name: 'AppForm',
      filePath: resolve('runtime/components/AppForm.vue')
    })
    addComponent({
      name: 'AppInput',
      filePath: resolve('runtime/components/AppInput.vue')
    })
  }
})
