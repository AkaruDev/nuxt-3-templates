import { en } from "./locales/en"
import { fr } from "./locales/fr"

export default defineI18nConfig(() => ({
    legacy: false,
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
    messages: {
        fr,
        en
    }
}))