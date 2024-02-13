
export default defineNuxtConfig(
    {
        modules: [
            '@nuxt/image',
            '@/modules/app-image/src/module',
        ],
        image: {
            // If prismic you can use this configuration
            /*
            provider: "prismic",
            prismic: {},
            */
            screens: { // All Breakpoints exist, only values are modifiable  :(
                xs: 768,
                sm: 768,
                md: 768,
                lg: 1080,
                xl: 1440,
                xxl: 1920,
            },
        },
    }
)