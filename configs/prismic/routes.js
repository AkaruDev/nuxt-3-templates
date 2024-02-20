const langDefault = 'fr-fr'
const langs = [langDefault]//, 'en-gb', 'es-es'
const routes = [
    {
        type: "page_home",
        lang: 'fr-fr',
        path: "/",
    },
    {
        type: "page",
        lang: 'fr-fr',
        path: "/:uid",
    },
]

let routesWithLang = []

routes.forEach(route => {
    langs.forEach(lang => {
        const code = lang === langDefault ? '' : '/' + lang.split('-')?.[0]
        const path = code + route.path
        const routeWithLang = { ...route, path, lang }

        routesWithLang.push(routeWithLang)
    })
})


export default routesWithLang
