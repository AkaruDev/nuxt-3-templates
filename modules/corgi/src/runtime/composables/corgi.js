import useRenderer from "./renderer"
import useScene from "./scene"
import useCamera from "./camera"
import { ref } from "vue"

/**
 *
 * @param {HTMLCanvasElement | OffscreenCanvas | void} canvas
 * @returns
 */
export default function useCorgi (canvas) {

  const scene = useScene()
  const renderer = useRenderer({ canvas })
  const camera = useCamera()
  const ellapsed = ref(0)

  /**
   *
   * @param {Number} time - Total time ellapsed in seconds
   */
  const render = (time) => {
    ellapsed.value = time// TODO maybe call an update method with ellapsed time or store it un a time manager

    renderer.render(scene, camera)
  }

  /**
   * Resize to fit given size
   * @param {Number} width
   * @param {Number} height
   */
  const resize = (width, height) => {
    renderer.resize(width, height)
  }

  return {
    scene,
    renderer,
    render,
    resize,
  }
}
