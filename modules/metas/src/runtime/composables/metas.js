import { useHead, useSeoMeta, useRoute, useRuntimeConfig } from "#imports"

export const useMetas = ({ title = null, description = null, image = null, siteName = null, twitterUser = null, lang = 'fr-FR' } = {}) => {

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
    viewport: 'viewport', content: 'width=device-width, initial-scale=1',
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
