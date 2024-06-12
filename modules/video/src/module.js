import { defineNuxtModule, addComponent, createResolver, addImports } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'video',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup() { // options, nuxt
    const resolver = createResolver(import.meta.url)

    // Exemples
    // Add composables
    addImports({
      name: 'useUID',
      as: 'useUID',
      from: resolver.resolve('runtime/composables/uid')
    })

    addImports({
      name: 'useVideo',
      as: 'useVideo',
      from: resolver.resolve('runtime/composables/useVideo')
    })

    addImports({
      name: 'useMuxStream',
      as: 'useMuxStream',
      from: resolver.resolve('runtime/composables/useMuxStream')
    })

    addImports({
      name: 'useVimeo',
      as: 'useVimeo',
      from: resolver.resolve('runtime/composables/useVimeo')
    })

    // Add components
    addComponent({
      name: 'AppVideo',
      filePath: resolver.resolve('runtime/components/AppVideo.vue')
    })

    addComponent({
      name: 'AppVideoVimeo',
      filePath: resolver.resolve('runtime/components/AppVideoVimeo.vue')
    })

    addComponent({
      name: 'AppVideoMux',
      filePath: resolver.resolve('runtime/components/AppVideoMux.vue')
    })

    addComponent({
      name: 'AppIframeVimeo',
      filePath: resolver.resolve('runtime/components/AppIframeVimeo.vue')
    })

    addComponent({
      name: 'AppIframeYoutube',
      filePath: resolver.resolve('runtime/components/AppIframeYoutube.vue')
    })

    addComponent({
      name: 'AppIframeEmbed',
      filePath: resolver.resolve('runtime/components/AppIframeEmbed.vue')
    })

    addComponent({
      name: 'AppVideoPlayButton',
      filePath: resolver.resolve('runtime/components/AppVideoPlayButton.vue')
    })

    addComponent({
      name: 'AppVideoControls',
      filePath: resolver.resolve('runtime/components/AppVideoControls.vue')
    })

  }
})
