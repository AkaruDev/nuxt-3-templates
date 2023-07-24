module.exports = {
  metas: {
    title: 'Eslint',
    description: 'Add eslint module and configs',
    category: 'Development helpers'
  },
  dependencies: [],
  devDependencies: ['eslint', '@nuxtjs/eslint-module', '@nuxt/eslint-config'],
  files: ['configs', '.eslintrc', '.eslintignore', '.editorconfig']
}
