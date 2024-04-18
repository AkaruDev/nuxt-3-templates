import fragment from '../shaders/flowmap.frag'
import { onMounted, onUnmounted } from 'vue'
import { useNormalizedMouse } from './normalized-mouse'

/**
 *
 * @param {{import('./corgi').UseCorgi}} corgi
 */
export const useFlowmap = (canvas) => {
  const mouse = useNormalizedMouse(canvas)

  onMounted(() => {
    console.info("flowmap mounted")

  })

  onUnmounted(() => { })
}
