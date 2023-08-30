import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/eslint-module', '../src/module'],
  viewportObserver: {
    active: false
  }
})
