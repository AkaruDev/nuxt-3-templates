
export default defineNuxtConfig(
  {
    modules: [
      '@/modules/page-transitions/src/module',
    ],
    app: {
      pageTransition: { name: 'page', mode: 'out-in' }
    },
  }
)