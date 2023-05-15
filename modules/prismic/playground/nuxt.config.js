
import { defineNuxtConfig } from 'nuxt/config'

/**
 * Environment informations
 */
const ENVIRONMENT = process.env.ENV || 'dev'
const IS_PREPROD = ENVIRONMENT === 'preprod'

console.log(ENVIRONMENT, IS_PREPROD);

export default defineNuxtConfig({
  modules: ['@nuxtjs/prismic', '../src/module'],
  prismic: {
    endpoint: 'https://nuxt-3-templates.cdn.prismic.io/api/v2',
    toolbar: false,
    preview: IS_PREPROD ? '/preview/' : false
  }
})
