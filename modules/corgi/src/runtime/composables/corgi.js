import { useRenderer } from "./renderer"
import { useScene } from "./scene"
import { useCamera } from "./camera"
import { ref } from "vue"
import { QUALITIES } from "../utils/types"
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
 * Return a new Corgi instance
 * @param {HTMLCanvasElement | OffscreenCanvas | void} canvas
 * @returns {UseCorgi}
 */
export const useCorgi = (canvas, quality = 1) => {

  const {
    scene,
    dispose: sceneDispose
  } = useScene()
  const {
    renderer,
    render: rendererRender,
    resize: rendererResize,
    dispose: rendererDispose,
  } = useRenderer({ canvas })
  const {
    camera,
    resize: cameraResize
  } = useCamera()
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
    rendererRender(scene, camera)
  }

  // Set the quality of the render, may be used for to change shadow quality for exemple
  const pixelRatio = quality === QUALITIES.HIGH ? 2 : 1
  renderer?.setPixelRatio(pixelRatio)

  /**
   * Resize to fit given size
   */
  const onResize = () => {
    const width = canvas?.clientWidth || 0
    const height = canvas?.clientHeight || 0

    cameraResize(width, height)
    rendererResize(width, height)
  }

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  const unmount = () => {
    gsap?.ticker?.remove(onTick)

    rendererDispose()
    sceneDispose()
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
