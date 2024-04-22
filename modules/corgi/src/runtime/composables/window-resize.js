import { onMounted, onUnmounted } from "vue"

/**
 * Callback when window resize
 * @param {function} callback
 */
export const useWindowResize = (callback) => {

  /**
   * Resize
   */
  const onResize = () => {
    callback?.()
  }

  // Lifecycle
  onMounted(() => {
    window.addEventListener("resize", onResize)
    onResize()
  })

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  onUnmounted(() => {
    window.removeEventListener("resize", onResize)
  })

}
