import { defineNuxtPlugin } from '#app'
import parallax from './directives/parallax'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('parallax', parallax())
})
