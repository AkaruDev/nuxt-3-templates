/**
 * Environment informations
 */
const ENVIRONMENT = process.env.ENV || 'dev'
const IS_PREPROD = ENVIRONMENT === 'preprod'

console.log(ENVIRONMENT, IS_PREPROD);

export default defineNuxtConfig(
    {
        modules: [
            '@nuxtjs/prismic',
            '@/modules/prismic/src/module',
        ],
        prismic: {
            endpoint: 'https://my-site.cdn.prismic.io/api/v2',
            toolbar: false,
            preview: IS_PREPROD ? '/preview/' : false
        }
    }
)