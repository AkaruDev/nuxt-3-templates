
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],
  extends: [
    './configs/app-link'
  ]
})
