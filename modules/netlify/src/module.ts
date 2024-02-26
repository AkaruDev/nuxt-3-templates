import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { generateRedirects } from './redirects'
import { generateHeaders } from './headers'
import { createFile } from './utils'

import type { RedirectType } from './types'

// Module options TypeScript interface definition
export interface ModuleOptions {
  headers: object,
  redirects: RedirectType[] | any,
  mergeSecurityHeaders: boolean,
  mergeCachingHeaders: boolean,
  transformHeaders: any
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'netlify-module',
    configKey: 'netlify'
  },
  defaults: {
    // add more headers
    headers: {},
    // turn off the default security headers
    mergeSecurityHeaders: true,
    // turn off the default caching headers
    mergeCachingHeaders: true,
    // optional transform for manipulating headers under each path (e.g.sorting), etc.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transformHeaders: (headers: any, path: any) => headers,
    // add redirects
    redirects: []
  },
  // Default configuration options of the Nuxt module
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (typeof options.redirects === 'function'){
      options.redirects = await options.redirects();
    }

    const publicPath = nuxt.options.dir.public;
    const redirectPath = resolver.resolve(
      nuxt.options.srcDir,
      publicPath,
      '_redirects'
    )
    const headersPath =resolver.resolve(
      nuxt.options.srcDir,
      publicPath,
      '_headers'
    )

    nuxt.hook('nitro:build:before', async () => {
      // generate redirects
      try {
        createFile(redirectPath, generateRedirects(options))
        console.log('Generated /_redirects')
      } catch (error) {
        console.error(error)
      }

      // generate headers
      try {
        const headersContent = generateHeaders({...options, publicPath: nuxt.options.app.buildAssetsDir})
        await createFile(headersPath, headersContent)
        console.log('Generated /_headers')
      } catch (error) {
        console.error(error)
      }
    })
  }
})
