
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/image'],
  image: {
    // If prismic you can use this configuration
    /*
    provider: "prismic",
    prismic: {},
    */
    screens: { // Example of custom breakpoints
      xs: 768,
      sm: 768,
      md: 768,
      lg: 1080,
      xl: 1440,
      xxl: 1920,
    },
  },
})
