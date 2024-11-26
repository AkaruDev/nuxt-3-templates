import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig(
  {
    css: ['@/assets/styles/app/index.scss'],
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',// or "modern", "legacy"
            additionalData: ' @use "@/assets/styles/shared/index.scss";'
          }
        }
      }
    },
  }
)