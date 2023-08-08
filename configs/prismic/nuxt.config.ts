import routes from "./routes"

const ENVIRONMENT = process?.env?.ENV || 'dev'
const IS_PREPROD = ENVIRONMENT === 'preprod'

export default defineNuxtConfig(
    {
        ssr: IS_PREPROD ? false : true,
        modules: [
            '@nuxtjs/prismic',
            '@/modules/prismic/src/module',
        ],
        prismic: {
            endpoint: 'https://my-site.cdn.prismic.io/api/v2',
            toolbar: IS_PREPROD,
            preview: IS_PREPROD ? '/preview/' : false,
            clientConfig: {
                routes
            },
            richTextSerializer: "~/configs/prismic/richTextSerializer"
        },
        runtimeConfig: {
            public: {
                langIso: process?.env?.LANG_ISO || 'fr-fr'
            }
        }
    }
)