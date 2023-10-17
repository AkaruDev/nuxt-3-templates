import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'sliders',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)

    // Add components
    addComponent({
      name: 'AppSlider', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppSlider.vue')
    })
    addComponent({
      name: 'AppAutoScroller', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppAutoScroller.vue')
    })
    addComponent({
      name: 'AppSlideShow', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppSlideShow.vue')
    })
    addComponent({
      name: 'AppBullets', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/AppBullets.vue')
    })

  }
})