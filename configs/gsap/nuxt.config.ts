
export default defineNuxtConfig(
    {
        plugins: [
            { src: '@/modules/gsap/src/module', ssr: false }
        ]
    }
)