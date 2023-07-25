
export default defineNuxtConfig(
    {
        modules: [
            '@nuxtjs/i18n',
        ],
        i18n: {
            locales: [
                {
                    code: 'fr',
                    iso: 'fr-fr',
                    name: 'fr',
                },
                {
                    code: 'en',
                    iso: 'en-gb',
                    name: 'en',
                },
            ],
            defaultLocale: 'fr',
        },
    }
)