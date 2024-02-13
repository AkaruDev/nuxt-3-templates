module.exports = {
  metas: {
    title: 'AppImage',
    description: 'Add image component',
    category: 'Components'
  },
  dependencies: ['@nuxt/image', 'sharp'],
  devDependencies: ['@vueuse/core', '@vueuse/components'],
  files: ['.yarnrc', 'modules/app-image/src', 'configs']
}
