
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/prismic', '../src/module'],
  prismic: {
    endpoint: 'https://nuxt-3-templates.cdn.prismic.io/api/v2',
    toolbar: false
  }
})
