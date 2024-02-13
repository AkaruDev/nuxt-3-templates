const isIndexed = process?.env?.ENV === 'prod'

const rules = isIndexed ?
    {
        UserAgent: '*',
        Disallow: ''
    }
    :
    {
        UserAgent: '*',
        Disallow: '/'
    }

export default defineNuxtConfig(
    {
        modules: [
            '@nuxtjs/robots'
        ],
        robots: {
            rules
        }
    }
)