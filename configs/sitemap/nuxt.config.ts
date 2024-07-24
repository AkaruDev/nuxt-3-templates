
export default defineNuxtConfig(
  {
    modules: ['@nuxtjs/sitemap'],
    site: {
      url: process.env.BASE_URL,
      trailingSlash: true,
    },
  }
)