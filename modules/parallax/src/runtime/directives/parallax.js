import { useRafFn, useIntersectionObserver } from '@vueuse/core'
import { clamp, lerp } from "../utils/math"

export default () => {
  // Directives options
  const options = {
    cssVar: '--plx-progress',
    margin: 100,
    hasLerp: true,
    hasClamp: true,
    normalised: false,
    onProgress: null,
    ratio: 0.1,
    precision: 6,
    offsetY: 0
  }

  // Variables
  let animations = []

  /**
   *
   * @param {Element} el
   * @param {Object} binding parameters
   */
  const mounted = (el, binding) => {
    const animation = {
      el,
      active: false,
      options: { ...options, ...binding.value },
      progress: { value: 0, lerp: 0 }
    }
    animations.push(animation)

    useIntersectionObserver(
      el,
      onIntersect,
      {
        threshold: 0,
        rootMargin: `${animation.options.margin}px 0px ${animation.options.margin}px 0px`
      }
    )

    useRafFn(() => onTick(animation))
  }


  /**
   * @param {Array<IntersectionObserverEntry>} entries
   */
  const onIntersect = (entries) => {
    entries.forEach(entry => {
      const animation = animations.find(({ el }) => el === entry.target)
      if (animation) {
        animation.active = entry.isIntersecting
        setProgress(animation)
      }
    })
  }

  const unmounted = (el) => {
    animations = animations.filter((animation) => animation.el !== el)
  }

  const onTick = (animation) => {
    setProgress(animation)
  }

  const setProgress = ({ el, active, progress, options }) => {
    if (!active) return;
    progress.value = getProgress(el, options)
    if (options.hasLerp) {
      progress.lerp = lerp(progress.lerp, progress.value, options.ratio).toFixed(options.precision)
    }

    el.style.setProperty(options.cssVar, options.hasLerp ? progress.lerp : progress.value)

    options?.onProgress?.({ el, ...progress })
  }

  const getProgress = (el, options) => {

    // Set offset
    let { top, height } = el.getBoundingClientRect()
    top -= options.offsetY
    height += options.offsetY

    // Compute value
    const value = Math.max(0, top + height)
    let progress = value / (window.innerHeight + height)

    //Clamp
    if (options.hasClamp) {
      progress = clamp(progress, 0, 1)
    }

    // Reset value to 0 - 1
    progress = 1 - progress

    // Normalised
    if (options.normalised) {
      progress = progress * 2 - 1
    }

    return progress
  }

  // Update bindings values
  const updated = (el, binding) => {
    if (binding.value) {
      const animation = animations.find((animation) => animation.el === el)

      if (animation) {
        animation.options = { ...animation.options, ...binding.value }
      }
    }
  }

  return {
    mounted,
    updated,
    unmounted
  }
}
