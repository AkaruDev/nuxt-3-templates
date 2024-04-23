import { gsap } from "gsap"
import { onMounted, onUnmounted } from "vue"

export const useTicker = (callback) => {
  onMounted(() => {
    gsap.ticker.add(callback)
  })
  onUnmounted(() => {
    gsap.ticker.remove(callback)
  })
}
