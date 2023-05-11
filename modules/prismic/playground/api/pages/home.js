import Formatter from '../utils/formatter'

import { usePrismic } from '@prismicio/vue'

const getHome = async () => {

  // Get lang
  /*
  const { localeProperties } = useI18n()
  const lang = localeProperties.value.iso
  */
  const lang = 'fr-fr'

  // Getting prismic
  const prismic = usePrismic()
  Formatter.setPrismic(prismic)
  const document = await prismic.client.getSingle('page_home',
    {
      graphQuery: `{
        page_home{
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
    title: Formatter.formatKeyText(document.data?.hero?.[0].title)
  }

  // Return formated content
  return {
    hero
  }
}

export default getHome
