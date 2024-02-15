import { PerspectiveCamera } from "three"

export default function useCamera () {
  const fov = 50
  const camera = new PerspectiveCamera(fov, 1, 0.1, 100)

  /**
   * Resize camera aspect
   * @param {Number} width
   * @param {Number} height
   */
  const resize = (width, height) => {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  /**
  * SetFov utils
  * @param {Number} fov - Field of view value between 1 - 150
  * @param {Number} height
  */
  const setFov = (fov) => {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }

  return { camera, resize, setFov }
}
