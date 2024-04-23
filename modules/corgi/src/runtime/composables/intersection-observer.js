import { onMounted, onUnmounted } from "vue"
/**
 *
 * @param {ref<HTMLElement>} element
 * @param {function} show - Callback method for when the element is intersecting
 * @param {function} hide  - Callback method for when the element is not intersecting
 */
export const useIntersectionObserver = (element, show, hide) => {

  const onIntersection = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        show?.()
      } else {
        hide?.()
      }
    }
  }
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(onIntersection)
    observer.observe(element.value)
  })
  onUnmounted(() => {
    observer?.disconnect()
  })
}
