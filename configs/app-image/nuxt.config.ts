
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
            screens: { // Example of custom breakpoints
                small: 768,
                medium: 1080,
                large: 1440,
                xxxlarge: 2560,
            },
        },
    }
)