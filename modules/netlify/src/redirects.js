import { FILE_COMMENT } from './constants'
import { createRedirectContent } from './utils'

export const generateRedirects = (options) => {
  let content = `${FILE_COMMENT}\n`;

  options.redirects.forEach(r => {
    content += createRedirectContent(r)
  })

  console.log(content)

  return content
}
