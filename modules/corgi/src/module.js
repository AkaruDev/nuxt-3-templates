import { defineNuxtModule, addComponent, createResolver, addVitePlugin, addImportsDir } from '@nuxt/kit'
import glsl from 'vite-plugin-glsl'

export default defineNuxtModule({
  meta: {
    name: 'corgi',
    configKey: 'corgi'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () {//options, nuxt
    const { resolve } = createResolver(import.meta.url)

    // Add vite plugins
    addVitePlugin(glsl())

    // Add composables
    addImportsDir(resolve('runtime/composables'))

    // Add components
    addComponent({
      name: 'CorgiCanvas',
      filePath: resolve('runtime/components/CorgiCanvas.vue')
    })
    addComponent({
      name: 'TheCorgiComponents',
      filePath: resolve('runtime/components/TheCorgiComponents.vue')
    })
    addComponent({
      name: 'CorgiComponent',
      filePath: resolve('runtime/components/CorgiComponent.vue')
    })
  }
})
