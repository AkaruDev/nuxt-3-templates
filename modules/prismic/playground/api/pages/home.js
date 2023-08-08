import Formatter from '../utils/formatter'
import { useRuntimeConfig } from '#app'

import { usePrismic } from '@prismicio/vue'

const getHome = async () => {
  // Get lang
  /*
  const { localeProperties } = useI18n()
  const lang = localeProperties.value.iso
  */
  const config = useRuntimeConfig()
  const lang = config?.public?.langIso || 'fr-fr'

  // Getting prismic
  const prismic = usePrismic()
  if (prismic.client === undefined) return null
  Formatter.setPrismic(prismic)
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
    title: Formatter.formatKeyText(document.data?.hero?.[0].title),
    link: document.data?.hero?.[0].link,
    text: Formatter.formatRichText(document.data?.hero?.[0].text),
    text2: document.data?.hero?.[0].text
  }

  // Return formated content
  return {
    hero
  }
}

export default getHome
