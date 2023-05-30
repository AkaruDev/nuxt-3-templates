import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig(
    {
        modules: [
            '@/modules/metas/src/module',
        ],
        runtimeConfig: {
            public: {
                baseUrl: process?.env?.BASE_URL || '',
                noIndex: process?.env?.ENV !== 'prod',
            }
        }
    }
)