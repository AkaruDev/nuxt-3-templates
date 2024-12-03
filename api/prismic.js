import { createPrismic } from '@prismicio/vue'
import { useRuntimeConfig } from '#app' //useNuxtApp
import formatter from './utils/formatter'

import routes from "../configs/prismic/routes"

import richTextSerializer from '../configs/prismic/richTextSerializer'

const usePrismicApi = () => {

  /*
  // Get lang from i18n
  const { $i18n } = useNuxtApp()
  let lang = $i18n.locale.value
  if (lang === "en") lang = "en-us"
  if (lang === "fr") lang = "fr-fr"
  */

  // Get lang
  const config = useRuntimeConfig()
  const lang = config?.public?.langIso || 'fr-fr'
  const endpoint = config?.public?.endpoint

  const prismic = createPrismic({ endpoint, clientConfig: { routes }, richTextSerializer })
  formatter.setPrismic(prismic)

  return { prismic, lang }
}


export default usePrismicApi
