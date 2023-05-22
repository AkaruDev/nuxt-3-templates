import linkResolver from './linkResolver'

const htmlSerializer = {
  // Those are just examples, update them and add your own~
  // heading1: ({ children }) => `<h2>${children}</h2>`,
  // paragraph: ({ children }) => `<p class="fooBar">${children}</p>`
  hyperlink: ({ node, children }) => {
    const target = node.data.target
      ? `target="${node.data.target}" rel="noopener"`
      : ''

    const nuxtLink = node.data.link_type === 'Document' ? 'data-nuxt-link' : ''
    const url = linkResolver(node.data)
    return `<a ${target} href="${url}" ${nuxtLink}>${children}</a>`
  }
}

export default htmlSerializer
