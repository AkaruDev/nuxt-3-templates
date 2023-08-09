import { createPrismic, usePrismic } from '@prismicio/vue'
import { useRuntimeConfig } from '#app'
import Formatter from './utils/formatter'

import routes from "../configs/prismic/routes"

import richTextSerializer from '../configs/prismic/richTextSerializer'

const usePrismicApi = () => {
  // Get lang
  /*
  const { localeProperties } = useI18n()
  const lang = localeProperties.value.iso
  */

  const config = useRuntimeConfig()
  const lang = config?.public?.langIso || 'fr-fr'
  const endpoint = config?.public?.endpoint

  const prismic = usePrismic() || createPrismic({ endpoint, clientConfig: { routes }, richTextSerializer })
  Formatter.setPrismic(prismic)

  return { prismic, lang }
}


export default usePrismicApi
