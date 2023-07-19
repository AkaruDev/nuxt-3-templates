import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { get } from 'https'
import unzipper from 'unzipper'
import { headersToJson, loading } from './utils'


const RFG_ENDPOINT = 'https://realfavicongenerator.net/api/favicon'
const RFG_KEY = '1d339536c98db47d71da9d952c85fd6df2fe9eeb'

export default defineNuxtModule({
  meta: {
    name: 'favicon',
    configKey: 'favicon'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.hook('ready', async nuxt => {
      // Icons folder
      const publicPath = resolver.resolve('../../../public/')
      const iconPath = resolver.resolve(publicPath, 'icons')
      const manifestPath = resolver.resolve(iconPath, 'manifest.json')

      // Check favicon does not exist
      const pathExist = existsSync(manifestPath)
      if (pathExist && !options?.force) {
        // Set metas from manifest file json
        const manifest = readFileSync(manifestPath)
        const data = JSON.parse(manifest)
        nuxt.options.app.head = { ...nuxt.options.app.head, ...data }
        return
      }

      // Get image from static file
      const pathImg = resolver.resolve(publicPath, options?.image || 'icon.png')
      // Image to base64
      let image
      try {
        image = readFileSync(pathImg, "base64")
      } catch (error) {
        console.error(error)
        return
      }


      // Add loading log to let know the users of what is happening
      const intervalID = loading('Favicon generation ')
      // Fetch api post options
      options = {
        favicon_generation: {
          api_key: RFG_KEY,
          files_location: {
            type: "path",
            path: "/icons"
          },
          force: false,
          master_picture: {
            type: "inline",
            content: image,
          },
          ...options,
        }
      }


      const result = await fetch(RFG_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(options)
      })
        .then(response => response.json())
        .catch(error => {
          clearInterval(intervalID)
          console.warn(error)
          return error
        })


      // Unzip files to public folder
      if (result?.favicon_generation_result?.result?.status === 'success') {
        // Set metas data from favicons
        const headers = result?.favicon_generation_result?.favicon?.html_code || null
        const data = headersToJson(headers)
        nuxt.options.app.head = { ...nuxt.options.app.head, ...data }

        // Store date in manifest file
        writeFileSync(manifestPath, JSON.stringify(data))

        // Unzip files
        const urlZip = result?.favicon_generation_result?.favicon?.package_url || null

        if (urlZip) {
          get(urlZip, (response) => {
            const stream = response.pipe(unzipper.Extract({ path: iconPath + '/' }))

            stream.on('finish', () => {
              // Move favicon.ico to public directory
              const favicon = readFileSync(resolver.resolve(publicPath, 'icons', 'favicon.ico'))
              writeFileSync(resolver.resolve(publicPath, 'favicon.ico'), favicon)

              clearInterval(intervalID)
              console.log('Favicon is created!')
            })


          })
        }
      } else {
        clearInterval(intervalID)
        console.warn(result)
      }
    })



  }
})
