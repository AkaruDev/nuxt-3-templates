
export default defineNuxtConfig(
    {
        modules: [
            '@/modules/device/src/module',
        ],
        build: {
            transpile: ['detect-gpu']
        }
    }
)