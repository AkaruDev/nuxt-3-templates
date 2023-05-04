// https://github.com/svg/svgo
module.exports = {
  multipass: true,
  js2svg: {
    indent: 2,
    pretty: true
  },
  plugins: [
    {
      name: 'preset-default'
    },
    {
      name: 'removeAttrs',
      active: true,
      params: {
        elemSeparator: '#',
        attrs: ['fill', 'stroke', 'id', 'class', 'style', 'xml:space', 'clip-rule']
      }
    },
    {
      name: 'removeViewBox',
      active: false
    },
    {
      name: 'removeDimensions',
      active: true
    }
  ]
}
