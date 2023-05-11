import { defineNuxtPlugin, navigateTo } from '#app'

export default defineNuxtPlugin(() => {
  window.addEventListener('click', event => {
    if (!event.target.matches('a[data-nuxt-link]')) return

    event.preventDefault()
    navigateTo(event.target.pathname)
  }, false)

})
