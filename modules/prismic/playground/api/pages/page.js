import formatter from '../utils/formatter'

import usePrismicApi from '../prismic'

const getPage = async (uid) => {

  // Getting prismic
  const { prismic, lang } = usePrismicApi()
  if (prismic.client === undefined) return null

  formatter.setPrismic(prismic)
  const document = await prismic.client.getByUID(
    'page',
    uid,
    {
      graphQuery: `{
          page {
            hero{
              title
            }
          }
        }`,
      lang
    }
  )

  // Format document here
  const hero = {
    title: formatter.formatKeyText(document.data?.hero?.[0].title)
  }

  // Return formated content
  return {
    hero
  }
}

export default getPage
