const linkResolver = (doc) => {
  console.info(doc)
  if (doc.isBroken) {
    return '/404/'
  }

  if (doc.type === 'page_home') {
    return `/`
  }

  if (doc.type === 'page') {
    return `/${doc.uid}/`
  }


  return '/'
}

export default linkResolver
