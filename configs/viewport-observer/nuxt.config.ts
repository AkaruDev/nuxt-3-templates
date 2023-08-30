
export default defineNuxtConfig(
    {
        modules: [
            '@/modules/viewport-observer/src/module',
        ],
        viewportObserver: {
            active: true
        }
    }
)