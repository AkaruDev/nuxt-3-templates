import { useHead, useSeoMeta, useRoute, useRuntimeConfig } from "#imports"

/**
 *
 * @param {Object} options
 * @param {string=} options.title
 * @param {string=} options.description
 * @param {string=} options.image - Url of an image. Size:1200x630
 * @param {string=} options.siteName
 * @param {string=} options.twitterUser
 * @param {string=} [options.lang=fr-FR]
 */
export const useMetas = (options) => {

  const { title = null, description = null, image = null, siteName = null, twitterUser = null, lang = 'fr-FR' } = options || {}

  const runtimeConfig = useRuntimeConfig()
  const baseUrl = runtimeConfig?.public?.baseUrl || ''
  const route = useRoute()

  const url = () => {
    return baseUrl + route.fullPath
  }

  useHead({
    htmlAttrs: {
      lang
    }
  })

  const noIndex = runtimeConfig.public.noIndex

  useSeoMeta({
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    url,
    ogUrl: url,
    ...(title ? { title, ogTitle: title, twitterTitle: title, ogSiteName: title } : {}),
    ...(siteName ? { ogSiteName: siteName } : {}),
    ...(description ? { description, ogDescription: description, twitterDescription: description } : {}),
    ...(image ? { ogImage: image, twitterImage: image } : {}),
    ...(twitterUser ? { twitterSite: twitterUser } : {}),
    twitterCard: 'summary_large_image',
    ...(noIndex ? {
      robots: {
        noIndex: true
      }
    } : {})

  })

}
