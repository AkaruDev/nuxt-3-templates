import { watch } from "vue"


export default (nuxtApp) => {
  const optionsDefault = {
    activeClass: '--in-view',
    threshold: 0,
    offset: 0,
    once: true,
    onEnter: null,
    onLeave: null,
  }

  return {
    /**
     * @param {HTMLElement} el
     * @param {*} bindings
     */
    mounted (el, bindings) {
      const options = { ...optionsDefault, ...bindings.value }
      const { $viewportObserver } = nuxtApp

      // Observer
      // TODO test with page changes
      // TODO find a way to clear the observer maybe ?
      /**
      * observer @type {IntersectionObserver}
      */
      let observer = null
      const onObserve = ([{ isIntersecting }]) => {
        if (isIntersecting) {
          options.onEnter?.()
          el.classList.add(options.activeClass)
          if (options.once) {
            observer.unobserve(el)
          }
        } else {
          options.onLeave?.()
          el.classList.remove(options.activeClass)
        }
      }
      observer = new IntersectionObserver(onObserve, {
        root: null,
        rootMargin: `0px 0px ${-options.offset}px 0px`,
        threshold: options.threshold
      })
      if ($viewportObserver.active.value) observer.observe(el)

      // Watch
      watch($viewportObserver.active, (newValue) => {
        if (newValue) {
          observer.observe(el)
        } else {
          observer?.disconnect()
          el.classList.remove(options.activeClass)
        }
      })

    },
  }
}
