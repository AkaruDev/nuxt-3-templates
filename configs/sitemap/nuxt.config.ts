
export default defineNuxtConfig(
    {
        modules: ['nuxt-simple-sitemap'],
        site: {
            url: process.env.BASE_URL,
            trailingSlash: true,
        },
    }
)