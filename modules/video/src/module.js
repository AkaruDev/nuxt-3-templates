import { defineNuxtModule, addComponent, createResolver, addImports } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'video',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)

    // Exemples
    // Add composables
    addImports({
      name: 'useVideoBus',
      as: 'useVideoBus',
      from: resolver.resolve('runtime/composables/video-bus')
    })

    // Add components
    addComponent({
      name: 'AppVideo',
      filePath: resolver.resolve('runtime/components/AppVideo.vue')
    })
    addComponent({
      name: 'AppVideoEmbed',
      filePath: resolver.resolve('runtime/components/AppVideoEmbed.vue')
    })

  }
})
