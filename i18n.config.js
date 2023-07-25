import { en } from "./configs/i18n/locales/en"
import { fr } from "./configs/i18n/locales/fr"

export default defineI18nConfig(() => ({
    legacy: false,
    messages: {
        fr,
        en
    }
}))