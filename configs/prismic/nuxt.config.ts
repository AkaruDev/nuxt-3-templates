/**
 * Environment informations
 */
const ENVIRONMENT = process?.env?.ENV || 'dev'
const IS_PREPROD = ENVIRONMENT === 'preprod'

export default defineNuxtConfig(
    {
        modules: [
            '@nuxtjs/prismic',
            '@/modules/prismic/src/module',
        ],
        prismic: {
            endpoint: 'https://my-site.cdn.prismic.io/api/v2',
            toolbar: IS_PREPROD,
            preview: IS_PREPROD ? '/preview/' : false
        },
        runtimeConfig: {
            public: {
                langIso: process?.env?.LANG_ISO || 'fr-fr'
            }
        }
    }
)