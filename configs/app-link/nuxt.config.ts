
export default defineNuxtConfig(
    {
        modules: [
            '@/modules/app-link/src/module',
        ],
        experimental: {
            defaults: {
                nuxtLink: {
                    activeClass: 'nuxt-link-active',
                    trailingSlash: 'append'
                }
            }
        },
    }
)