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
    observer: null,
    /**
     * @param {HTMLElement} el
     * @param {*} bindings
     */
    mounted (el, bindings, vnode) {
      const options = { ...optionsDefault, ...bindings.value }
      const { $viewportObserver } = nuxtApp

      // Set observer
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
      vnode.observer = observer

      // Watch global active state
      watch($viewportObserver.active, (newValue) => {
        if (newValue) {
          vnode.observer.observe(el)
        } else {
          vnode.observer?.disconnect()
          el.classList.remove(options.activeClass)
        }
      })

    },
    unmounted (el, bindings, vnode) {
      vnode?.observer?.disconnect()
      vnode.observer = null
    },
  }

}
