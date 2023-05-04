// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig(
  {
    modules: [
      '@nuxtjs/eslint-module',
      '@nuxt/image-edge',
      '@vueuse/nuxt',
    ],
    vite: {
      plugins: [
        svgLoader(), // https://github.com/jpkleemans/vite-svg-loader#readme,
      ]
    }
  }
)
