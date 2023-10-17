import routes from "../../configs/prismic/routes"

export const getRedirects = async ({ prismicEndpoint, prismic, fetch }) => {
  const client = await prismic.createClient(prismicEndpoint, { routes, fetch })

  const response = await client.get({
    predicates: prismic.predicate.at('document.type', 'redirects'),
    lang: '*' 
  })

  const redirects = []
  
  response.results.forEach((result) => {
    result.data.redirects
      .forEach((item) => {
        if (item.from && item.to?.url) {
          redirects.push({
            from: item.from,
            to: item.to,
            status: 301,
            force: true
          })
        }
      })
  })

  return redirects
}
