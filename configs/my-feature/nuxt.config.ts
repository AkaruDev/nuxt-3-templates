import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig(
    {
        modules: [
            '@/modules/app-svg/src/module',
        ],
        vite: {
            plugins: [
                svgLoader(), // https://github.com/jpkleemans/vite-svg-loader#readme
            ]
        }
    }
)