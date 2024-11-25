import { createPrismic } from '@prismicio/vue'
import { useRuntimeConfig } from '#app' //useNuxtApp
import formatter from './utils/formatter'

import routes from "../configs/prismic/routes"

import richTextSerializer from '../configs/prismic/richTextSerializer'

const usePrismicApi = () => {
  // Get lang
  /*
  // From i18n
  const { $i18n } = useNuxtApp()
  const lang = $i18n.language
  */

  const config = useRuntimeConfig()
  const lang = config?.public?.langIso || 'fr-fr'
  const endpoint = config?.public?.endpoint

  const prismic = createPrismic({ endpoint, clientConfig: { routes }, richTextSerializer })
  formatter.setPrismic(prismic)

  return { prismic, lang }
}


export default usePrismicApi
