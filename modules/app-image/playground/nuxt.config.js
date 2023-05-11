
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/image-edge'],
  /*
  // If prismic you can use this configuration
  image: {
    provider: "prismic",
    prismic: {},
    screens: {
      small: 768,
      medium: 1080,
      large: 1440,
      xlarge: 1660,
      xxlarge: 1920,
      xxxlarge: 2560,
    },
  },
  */
})
