
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
      small: 768,
      medium: 1080,
      large: 1440,
      xlarge: 1660,
      xxlarge: 1920,
      xxxlarge: 2560,
    },
  },
})
