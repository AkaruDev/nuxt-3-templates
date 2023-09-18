import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { getRedirects } from '../../../api/utils/redirects'

import * as prismic from "@prismicio/client";
import fetch from 'node-fetch'

export default defineNuxtModule({
  meta: {
    name: 'prismic',
    configKey: 'akaru-prismic'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    redirects: null // "netlify"
  },
  async setup (option, nuxt) { // options, nuxt
    
    if (option.redirects === 'netlify') {
      if (!option.modules?.includes('@aceforth/nuxt-netlify')) console.warn("Please install and uncomment netlify module in nuxt config file : npm install @aceforth/nuxt-netlify")
      const redirects = await getRedirects({ prismicEndpoint: nuxt.options.prismic.endpoint, prismic, fetch })

      if (!nuxt.options.netlify) nuxt.options.netlify = {}
      nuxt.options.netlify.redirects = redirects
    }

    const resolver = createResolver(import.meta.url)
    addPlugin(resolver.resolve('./runtime/plugins/richTextLinks.client'))
  }
})
