import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'prismic',
    configKey: 'akaruPrismic'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () { // options, nuxt
    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/plugins/richTextLinks.client'))

  }
})
