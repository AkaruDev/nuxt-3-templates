import { gsap } from 'gsap'
import { onMounted, onUnmounted } from "vue"

/**
 *
 * @param {gsap.TimelineVars} options
 * @param {function} resizeCallback
 * @returns {gsap.core.Timeline}
 */
export const useTimeline = (options = undefined, resizeCallback = null) => {
  const tl = gsap.timeline(options)

  const onResize = () => {
    resizeCallback?.()
  }

  onMounted(() => {
    if (resizeCallback) window.addEventListener("resize", onResize)
  })

  onUnmounted(() => {
    if (resizeCallback) window.removeEventListener("resize", onResize)
    tl?.kill()
  })
  return tl
}
