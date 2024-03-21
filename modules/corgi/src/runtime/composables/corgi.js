import { useRenderer } from "./renderer"
import { useScene } from "./scene"
import { useCamera } from "./camera"
import { ref } from "vue"
import { QUALITIES } from "../utils/types"
import { gsap } from "gsap"
import { PMREMGenerator } from "three"

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

  const orbitControls = null

  const ellapsed = ref(0)

  const pmremGenerator = new PMREMGenerator(renderer)
  pmremGenerator.compileCubemapShader()

  // Methods
  /**
   * Add your environnement map helper
   * @param {import('three').DataTexture} texture - EXR texture from EXRLoader
   * @param {Boolean} showInBacground - Add texture to be visible in the scene
   */
  const addEnvmap = (texture, showInBacground = true) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    if (showInBacground) scene.background = envMap
    scene.environment = envMap

    texture.dispose()
    pmremGenerator.dispose()
  }

  /**
   * @param {Number} time - Total time ellapsed in seconds
   */
  const onTick = (time) => {
    ellapsed.value = time // TODO maybe call an update method with ellapsed time or store it un a time manager
    render()
  }

  const render = () => {
    orbitControls?.update?.()
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
   * Add orbit controls
   */
  const addOrbitControls = () => {
    import('three/addons/controls/OrbitControls.js').then(rs => {
      const controls = new rs.OrbitControls(camera, canvas)
      controls.update()
    })
  }

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  const unmount = () => {
    gsap?.ticker?.remove(onTick)
    window.removeEventListener("resize", onResize)

    rendererDispose()
    sceneDispose()
  }

  // Observer
  gsap.ticker.add(onTick)
  window.addEventListener("resize", onResize)
  onResize()

  return {
    scene,
    renderer,
    camera,
    addEnvmap,
    addOrbitControls,
    unmount,
  }
}
