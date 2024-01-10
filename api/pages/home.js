import formatter from '../utils/formatter'

import usePrismicApi from '../prismic'

const getHome = async () => {

  // Getting prismic
  const { prismic, lang } = usePrismicApi()
  const document = await prismic.client.getSingle('page_home',
    {
      graphQuery: `{
        page_home{
          hero{
            title
            link
            text
          }
        }
      }`,
      lang
    }
  )


  // Format document here
  const hero = {
    title: formatter.formatKeyText(document.data?.hero?.[0].title),
    link: document.data?.hero?.[0].link,
    text: formatter.formatRichText(document.data?.hero?.[0].text),
    text2: document.data?.hero?.[0].text
  }

  // Return formated content
  return {
    hero
  }
}

export default getHome
