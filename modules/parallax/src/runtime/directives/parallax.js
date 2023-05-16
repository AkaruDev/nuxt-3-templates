import { useRafFn, useIntersectionObserver } from '@vueuse/core'

import { clamp, lerp } from "../utils/math"

export default () => {
  // Directives options
  const options = {
    cssVar: '--plx-progress',
    marge: 100,
    hasLerp: true,
    hasClamp: true,
    onProgress: null,
    ratio: 0.1,
    offset: 0
    // TODO see for adding an offset maybe ?
  }

  // Variables
  let animations = []


  /**
   *
   * @param {Element} el
   * @param {Object} elOptions parameters
   */
  const mounted = (el, elOptions) => {
    const animation = {
      el,
      active: false,
      options: { ...options, ...elOptions.value },
      progress: { value: 0, lerp: 0 }
    }
    animations.push(animation)

    useIntersectionObserver(
      el,
      onIntersect,
      {
        threshold: 0,
        rootMargin: `${animation.options.marge}px 0px ${animation.options.marge}px 0px`
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
    progress.value = getProgress(el, options.hasClamp)
    if (options.hasLerp) {
      progress.lerp = lerp(progress.lerp, progress.value, options.ratio)
    }

    el.style.setProperty(options.cssVar, options.hasLerp ? progress.lerp : progress.value)

    options?.onProgress?.({ el, progress })
  }

  const getProgress = (el, hasClamp) => {
    const { top, height } = el.getBoundingClientRect()

    const value = Math.max(0, top + height)
    let progress = value / (window.innerHeight + height)

    if (hasClamp) {
      progress = clamp(progress, 0, 1)
    }

    return 1 - progress
  }

  return {
    mounted,
    unmounted
  }
}
