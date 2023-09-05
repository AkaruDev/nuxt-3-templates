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
      name: 'useUID',
      as: 'useUID',
      from: resolver.resolve('runtime/composables/uid')
    })

    // Add components
    addComponent({
      name: 'AppVideoVimeo',
      filePath: resolver.resolve('runtime/components/AppVideoVimeo.vue')
    })
    addComponent({
      name: 'AppVideoEmbed',
      filePath: resolver.resolve('runtime/components/AppVideoEmbed.vue')
    })
    addComponent({
      name: 'AppVideo',
      filePath: resolver.resolve('runtime/components/AppVideo.vue')
    })
    addComponent({
      name: 'AppPlayerEmbed',
      filePath: resolver.resolve('runtime/components/AppPlayerEmbed.vue')
    })
    addComponent({
      name: 'AppPlayerVimeo',
      filePath: resolver.resolve('runtime/components/AppPlayerVimeo.vue')
    })
    addComponent({
      name: 'AppVideoControls',
      filePath: resolver.resolve('runtime/components/AppVideoControls.vue')
    })

  }
})
