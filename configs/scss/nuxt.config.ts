
export default defineNuxtConfig(
  {
    css: ['@/assets/styles/global/index.scss'],
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: '@use "sass:math"; @import "@/assets/styles/shared/index.scss";'
          }
        }
      }
    },
  }
)