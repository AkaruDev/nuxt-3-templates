
import { clamp } from "../utils/math"
import { useSmoothScroll } from '../composables/smooth-scroll'

export default () => {
  const $smoothScroll = useSmoothScroll()
  let options = { active: true, marge: 100, onProgress: null, customProgress: null }
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
      startBound: null,
      progress: 0,
      onScroll: () => onScroll(sticky),
      onResize: () => onResize(sticky),
      options: { ...options, ...elOptions.value }
    }

    stickys.push(sticky)

    $smoothScroll.on('scroll', sticky.onScroll)
    $smoothScroll.on('resize', sticky.onResize)

    setInitialBounds(sticky);
  }

  const updated = (el, elOptions) => {
    unmounted(el)

    const sticky = {
      el,
      elBounds: null,
      parent: el.parentNode,
      parentBounds: null,
      startElBounds: null,
      startParentBounds: null,
      progress: 0,
      onScroll: () => onScroll(sticky),
      onResize: () => onResize(sticky),
      options: { ...options, ...elOptions.value }
    }

    stickys.push(sticky)

    $smoothScroll.on('scroll', sticky.onScroll)
    $smoothScroll.on('resize', sticky.onResize)

    setInitialBounds(sticky);
  }

  const unmounted = (el) => {
    const sticky = stickys.find((sticky) => sticky.el === el)
    if (sticky) {
      $smoothScroll.off('scroll', sticky.onScroll)
      $smoothScroll.off('resize', sticky.onResize)
    }
    stickys = stickys.filter((sticky) => sticky.el !== el)
  }

  const setInitialBounds = (sticky) => {
    sticky.startElBounds = sticky.el.getBoundingClientRect()
    sticky.startParentBounds = sticky.parent.getBoundingClientRect()

    sticky.startElBounds = {
      top: sticky.startElBounds.top + $smoothScroll.y.value,
      height: sticky.startElBounds.height
    }
    sticky.startParentBounds = {
      top: sticky.startParentBounds.top + $smoothScroll.y.value,
      height: sticky.startParentBounds.height
    }
  }

  const setBound = (sticky) => {
    sticky.elBounds = sticky.startElBounds
    sticky.parentBounds = sticky.startParentBounds

    sticky.elBounds = {
      top: sticky.elBounds.top - $smoothScroll.y.value,
      height: sticky.elBounds.height
    }
    sticky.parentBounds = {
      top: sticky.parentBounds.top - $smoothScroll.y.value,
      height: sticky.parentBounds.height
    }
  }

  const sendProgress = (sticky) => {
    if (sticky.options.onProgress) sticky.options.onProgress({ el: sticky.el, progress: sticky.progress })
  }

  const sendCustomProgress = () => {
    stickys.forEach(sticky => {
      if (sticky.options.customProgress?.onProgress) sticky.options.customProgress?.onProgress({ el: sticky.el, progress: sticky.progressCustom })
    })
  }

  const onScroll = (sticky) => {
    if (!sticky?.options.active) return
    setBound(sticky)

    sticky.el.style.position = 'sticky'
    const isInBounds = sticky.parentBounds.top <= 0 && sticky.parentBounds.top + sticky.parentBounds.height - sticky.elBounds.height >= 0
    if (isInBounds) {
      sticky.progress = (- sticky.parentBounds.top) / (sticky.parentBounds.height - sticky.elBounds.height)
      if (isNaN(sticky.progress)) sticky.progress = 0

      sticky.progress = clamp(sticky.progress, 0, 1)
      sendProgress(sticky)
    } else {
      if (!isInBounds && sticky.progress <= 0.2 && sticky.progress > 0) {
        sticky.progress -= 0.01
        sticky.progress = clamp(sticky.progress, 0, 1)
        sendProgress(sticky)
      }
    }

    if (sticky.options.customProgress){
      sticky.progressCustom = (-sticky.parentBounds.top + (sticky.options.customProgress.nbScreen * window.innerHeight)) / (sticky.parentBounds.height - sticky.elBounds.height + (sticky.options.customProgress.nbScreen * window.innerHeight) )
      sendCustomProgress()
    }

  }

  const onResize = (sticky)=> {
    setInitialBounds(sticky);
  }

  return {
    mounted,
    unmounted,
    updated
  }
}
