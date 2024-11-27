const isIndexed = process?.env?.ENV === 'prod'

export default defineNuxtConfig(
  {
    modules: [
      '@nuxtjs/robots'
    ],
    site: { indexable: isIndexed }
  }
)
