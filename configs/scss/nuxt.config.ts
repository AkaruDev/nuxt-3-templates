
export default defineNuxtConfig(
  {
    css: ['@/assets/styles/global/index.scss'],
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',// or "modern", "legacy"
            additionalData: '@use "sass:math"; @import "@/assets/styles/shared/index.scss";'
          }
        }
      }
    },
  }
)