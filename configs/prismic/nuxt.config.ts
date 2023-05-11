
export default defineNuxtConfig(
    {
        modules: [
            '@nuxtjs/prismic',
            '@/modules/prismic/src/module',
        ],
        prismic: {
            endpoint: 'https://my-site.cdn.prismic.io/api/v2',
            toolbar: false
        },
    }
)