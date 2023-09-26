
import { clamp } from "../utils/math"
import { useVirtualScroll } from '../composables/virtual-scroll'

export default () => {
  const $virtualScroll = useVirtualScroll()
  let options = { active: true, marge: 100, onProgress: null }
  let stickys = []

  /**
   *
   * @param {Element} el
   * @param {Object} elOptions parameters
   */
  const mounted = (el, elOptions) => {
    const sticky = {
      el,
      elBounds: null,
      parent: el.parentNode,
      parentBounds: null,
      progress: 0,
      onScroll: () => onScroll(sticky),
      options: { ...options, ...elOptions.value }
    }
    el.style.willChange = 'transform'
    stickys.push(sticky)

    $virtualScroll.on('scroll', sticky.onScroll)
  }

  const unmounted = (el) => {
    const sticky = stickys.find((sticky) => sticky.el === el)
    if (sticky) $virtualScroll.off('scroll', sticky.onScroll)
    stickys = stickys.filter((sticky) => sticky.el !== el)

    el.style.willChange = ''
  }

  const setBound = (sticky) => {
    sticky.elBounds = sticky.el.getBoundingClientRect()
    sticky.parentBounds = sticky.parent.getBoundingClientRect()
  }

  const sendProgress = (sticky) => {
    if (sticky.options.onProgress) sticky.options.onProgress({ el: sticky.el, progress: sticky.progress })
  }

  const onScroll = (sticky) => {
    if (!sticky.options.active) return
    setBound(sticky)

    if ($virtualScroll.active.value) {
      const isInBounds = sticky.parentBounds.top <= sticky.options.marge && sticky.parentBounds.top + sticky.parentBounds.height - sticky.elBounds.height >= -sticky.options.marge
      if (isInBounds) {
        const max = sticky.parentBounds.height - sticky.elBounds.height
        const value = sticky.parentBounds.top * -1
        const y = clamp(value, 0, max) + 0.001
        sticky.el.style.transform = `translate3D(0,${y}px,0) `

        sticky.progress = (sticky.elBounds.top - sticky.parentBounds.top) / (sticky.parentBounds.height - sticky.elBounds.height)
        if (isNaN(sticky.progress)) sticky.progress = 0
        sticky.progress = clamp(sticky.progress, 0, 1)

        sendProgress(sticky)
      }

      if (!isInBounds && sticky.progress <= 0.2 && sticky.progress > 0) {
        sticky.progress -= 0.01
        sticky.progress = clamp(sticky.progress, 0, 1)
        sendProgress(sticky)
      }
    } else {
      const isInBounds = sticky.parentBounds.top <= 0 && sticky.parentBounds.top + sticky.parentBounds.height - sticky.elBounds.height >= 0
      if (isInBounds) {
        sticky.el.style.position = 'fixed'
        sticky.el.style.top = ''
        sticky.el.style.width = ''
        sticky.el.style.transform = ''

        sticky.progress = (sticky.elBounds.top - sticky.parentBounds.top) / (sticky.parentBounds.height - sticky.elBounds.height)
        if (isNaN(sticky.progress)) sticky.progress = 0

        sticky.progress = clamp(sticky.progress, 0, 1)
        sendProgress(sticky)
      } else {
        sticky.el.style.position = ''
        sticky.el.style.top = ''
        sticky.el.style.width = ''

        if (sticky.parentBounds.top <= 0) {
          sticky.el.style.transform = `translateY(${sticky.parentBounds.height - sticky.elBounds.height}px)`
        }

        if (!isInBounds && sticky.progress <= 0.2 && sticky.progress > 0) {
          sticky.progress -= 0.01
          sticky.progress = clamp(sticky.progress, 0, 1)
          sendProgress(sticky)
        }


      }
    }


  }
  return {
    mounted,
    unmounted
  }
}

