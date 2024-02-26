
const { DEFAULT_HEADER_VALUES } = require('./constants')
import { ensureFile, writeFile } from 'fs-extra'

const isEmptyObject = input => Object.keys(input).length === 0

export const createRedirectContent = (r) => {
  const redirect = Object.assign({}, DEFAULT_HEADER_VALUES, r)
  const divider = '    '

  // from
  let content = `${redirect.from}${divider}`

  // query params
  if (redirect.query && !isEmptyObject(redirect.query)) {
    content += Object.keys(redirect.query)
      .map(k => `${k}=${redirect.query[k]}`)
      .join('  ')
    content += divider
  }

  // to
  if (redirect.to) {
    content += `${redirect.to}${divider}`
  }

  // status
  content += `${redirect.status}${redirect.force ? '!' : ''}`

  // conditions
  if (redirect.conditions && !isEmptyObject(redirect.conditions)) {
    content += divider
    content += Object.keys(redirect.conditions)
      .map(k => `${k}=${redirect.conditions[k]}`)
      .join('  ')
  }

  return `${content}\n`
}

export const createFile = async (filePath, content) => {
  // if (await existsSync(filePath)) {
  //   await appendFile(filePath, `\n\n${content}`)
  // } else {
    await ensureFile(filePath)
    await writeFile(filePath, content)
  // }
}

export const createHeadersContent = (headers, path) => {
  let content = `${path}\n`

  headers.forEach(h => {
    content += `  ${h}\n`
  })

  return `${content}\n`
}

export const appendHeaders = (headersList, key, headers) => {
  if (headersList[key]) {
    headersList[key].push(...headers)
  } else {
    headersList[key] = headers
  }

  headersList[key] = Array.from(new Set(headersList[key]))

  return headersList
}

export const isUrl = (url) => {
  return ['http', '//'].some(str => url.startsWith(str))
}
