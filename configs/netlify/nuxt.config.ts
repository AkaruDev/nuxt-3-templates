const IS_PREPROD = process?.env?.ENV !== 'prod'

let headers = {}
if (IS_PREPROD) {
  headers = {
    '/*': [
      'X-Robots-Tag: noindex'
    ]
  }
}

export default defineNuxtConfig(
  {
      modules: [
          '@/modules/netlify/src/module',
      ],
      netlify: {
        redirects: [],
        headers: headers
      },
  }
)
