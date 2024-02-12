
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
      onResize: () => onResize(sticky),
      options: { ...options, ...elOptions.value },
      timeoutId: null,
    }

    el.style.willChange = 'transform'
    stickys.push(sticky)

    $virtualScroll.on('scroll', sticky.onScroll)
    $virtualScroll.on('resize', sticky.onResize)
    sticky.onResize()
  }

  const unmounted = (el) => {
    const sticky = stickys.find((sticky) => sticky.el === el)
    if (sticky) {
      $virtualScroll.off('scroll', sticky.onScroll)
      $virtualScroll.off('resize', sticky.onResize)
    }
    stickys = stickys.filter((sticky) => sticky.el !== el)

    el.style.transform = ``
    el.style.willChange = ''
  }

  const setBound = (sticky) => {
    sticky.elBounds = sticky.el.getBoundingClientRect()
    sticky.parentBounds = sticky.parent.getBoundingClientRect()
  }

  const sendProgress = (sticky) => {
    if (sticky.options.onProgress) sticky.options.onProgress({ el: sticky.el, progress: sticky.progress })
  }

  const onResize = (sticky) => {
    sticky.el.style.transform = `translate3d(0,0,0)`
    sticky.progress = 0
    setBound(sticky)
  }

  const onScroll = (sticky) => {
    if (!sticky.options.active) return

    const parentTop = sticky.parentBounds.top - $virtualScroll.y.lerp
    const elTop = sticky.elBounds.top - $virtualScroll.y.lerp

    if ($virtualScroll.active.value) {
      const isInBounds =
        parentTop <= sticky.options.marge
        && parentTop + sticky.parentBounds.height - sticky.elBounds.height >= -sticky.options.marge
      if (isInBounds) {
        const max = sticky.parentBounds.height - sticky.elBounds.height
        const value = parentTop * -1
        const y = clamp(value, 0, max) + 0.001
        sticky.el.style.transform = `translate3d(0,${y}px,0)`

        sticky.progress = (sticky.parentBounds.top - elTop) / (sticky.parentBounds.height - sticky.elBounds.height)
        if (isNaN(sticky.progress)) sticky.progress = 0
        sticky.progress = clamp(sticky.progress, 0, 1)

        sendProgress(sticky)
      }

      if (!isInBounds && sticky.progress <= 0.2 && sticky.progress > 0) {
        sticky.progress -= 0.01
        sticky.progress = clamp(sticky.progress, 0, 1)
        sticky.el.style.transform = `translate3d(0,0,0)`
        sendProgress(sticky)
      }
    } else {
      sticky.el.style.transform = ''
      const isInBounds = parentTop <= sticky.options.marge && parentTop + (sticky.parentBounds.height - sticky.elBounds.height * 2) >= sticky.options.marge
      if (isInBounds) {
        sticky.el.style.position = 'fixed'

        sticky.progress = (sticky.parentBounds.top - elTop) / (sticky.parentBounds.height - sticky.elBounds.height)
        if (isNaN(sticky.progress)) sticky.progress = 0

        sticky.progress = clamp(sticky.progress, 0, 1)
        sendProgress(sticky)
      } else {
        sticky.el.style.position = ''

        if (parentTop <= 0) {
          sticky.el.style.transform = `translate3d(0,${(sticky.parentBounds.height) - (sticky.elBounds.height * 2)}px,0)`
        }

        if (sticky.timeoutId) clearTimeout(sticky.timeoutId)
        goToZeroWhenNotInBounds(sticky)
      }
    }
  }

  const goToZeroWhenNotInBounds = (sticky) => {
    if (sticky.progress <= 0.3 && sticky.progress > 0) {
      sticky.progress -= 0.01
      sticky.progress = clamp(sticky.progress, 0, 1)
      sendProgress(sticky)
      sticky.timeoutId = setTimeout(() => {
        goToZeroWhenNotInBounds(sticky)
      }, 50)
      sticky.timeoutId = null
    }
  }
  return {
    mounted,
    unmounted
  }
}

