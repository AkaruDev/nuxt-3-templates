export const DEFAULT_HEADER_VALUES = {
  from: null,
  to: null,
  status: 301,
  force: false,
  query: {},
  conditions: {}
}

export const SECURITY_HEADERS = {
  '/*': [
    'Referrer-Policy: origin',
    'X-Content-Type-Options: nosniff',
    'X-Frame-Options: DENY',
    'X-XSS-Protection: 1; mode=block'
  ]
}

export const CACHING_HEADERS = {
  '/_nuxt/*': ['Cache-Control: public, max-age=31536000, immutable'],
  '/sw.js': ['Cache-Control: no-cache']
}

export const FILE_COMMENT = '## Created with netlify module from akaru-studio (inspired by https://github.com/juliomrqz/nuxt-netlify)'
