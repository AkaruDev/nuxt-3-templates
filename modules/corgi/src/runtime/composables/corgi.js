import useRenderer from "./renderer"
import useScene from "./scene"
import useCamera from "./camera"
import { ref } from "vue"

import { useResizeObserver } from '@vueuse/core'
import { gsap } from "gsap"


/**
 * @typedef {Object} UseCorgi
 * @property {THREE.Scene} scene - THREE.Scene
 * @property {THREE.WebGLRenderer} renderer - THREE.WebGLRenderer
 * @property {THREE.PerspectiveCamera} camera - THREE.PerspectiveCamera
 * @property {Function} unmount - Remove all event listener, clear all that need to be cleaned (textures etc)
 */

/**
 *
 * @param {HTMLCanvasElement | OffscreenCanvas | void} canvas
 * @returns {UseCorgi}
 */
export default function useCorgi (canvas) {

  const scene = useScene()
  const renderer = useRenderer({ canvas })
  const { camera, resize: cameraResize } = useCamera()
  const ellapsed = ref(0)

  // Methods

  /**
   * @param {Number} time - Total time ellapsed in seconds
   */
  const onTick = (time) => {
    ellapsed.value = time // TODO maybe call an update method with ellapsed time or store it un a time manager
    render()
  }

  const render = () => {
    renderer.render(scene, camera)
  }

  /**
   * Resize to fit given size
   */
  const onResize = () => {
    const width = canvas?.clientWidth || 0
    const height = canvas?.clientHeight || 0

    cameraResize(width, height)
    renderer.resize(width, height)
  }

  const unmount = () => {
    gsap?.ticker?.remove(onTick)
  }

  // Observer
  gsap.ticker.add(onTick)
  useResizeObserver(canvas, onResize)

  return {
    scene,
    renderer,
    camera,
    unmount,
  }
}
