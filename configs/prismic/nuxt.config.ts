import routes from "./routes"

const ENVIRONMENT = process?.env?.ENV || 'dev'
const IS_PREPROD = ENVIRONMENT === 'preprod'

const endpoint = process?.env?.PRISMIC_ENDPOINT
if (!endpoint) {
  console.error("Missing prismic endpoint in the environnement variable.")
}

export default defineNuxtConfig(
  {
    // ssr: IS_PREPROD ? false : true,
    modules: [
      '@nuxtjs/prismic',
      '@/modules/prismic/src/module',
      // '@aceforth/nuxt-netlify' // Use if redirects === "netlify"
    ],
    prismic: {
      endpoint,
      toolbar: IS_PREPROD,
      preview: IS_PREPROD ? '/preview/' : false,
      clientConfig: {
        routes
      },
      richTextSerializer: "~/configs/prismic/richTextSerializer"
    },
    runtimeConfig: {
      public: {
        endpoint,
        langIso: process?.env?.LANG_ISO || 'fr-fr'
      }
    },
    app: {
      head: {
        link: [
          {
            rel: "preconnect",
            href: "https://prismic.io",
            crossorigin: "anonymous"
          }
        ]
      }
    },
    // "akaru-prismic": {
    //     redirects: "netlify" // Options : "netlify" or null
    // }
  }
)
