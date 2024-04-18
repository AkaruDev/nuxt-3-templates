import { useScene } from "./scene"
import { useCamera } from "./camera"
import { ref, onMounted, onUnmounted } from "vue"
import { QUALITIES } from "../utils/types"
import { gsap } from "gsap"
import { PMREMGenerator, WebGLRenderer } from "three"
import { } from "vue"

/**
 * @typedef {Object} UseCorgi
 * @property {import('three').Scene} scene - THREE.Scene
 * @property {import('three').WebGLRenderer} renderer - THREE.WebGLRenderer
 * @property {import('three').PerspectiveCamera} camera - THREE.PerspectiveCamera
 * @property {Function} unmount - Remove all event listener, clear all that need to be cleaned (textures etc)
 */

/**
 * Return a new Corgi instance
 * @param {ref<HTMLCanvasElement | OffscreenCanvas | void>} canvas
 * @returns {UseCorgi}
 */
export const useCorgi = (canvas, quality = 1) => {

  const {
    scene,
    dispose: sceneDispose
  } = useScene()

  let renderer = ref(null)

  const {
    camera,
    resize: cameraResize
  } = useCamera()

  const orbitControls = null

  const ellapsed = ref(0)

  let pmremGenerator = null

  // Methods
  /**
   * Add your environnement map helper
   * @param {import('three').DataTexture} texture - EXR texture from EXRLoader
   * @param {Boolean} showInBacground - Add texture to be visible in the scene
   */
  const addEnvmap = (texture, showInBacground = true) => {
    const envMap = pmremGenerator?.fromEquirectangular(texture).texture
    if (showInBacground) scene.background = envMap
    scene.environment = envMap

    texture.dispose()
    pmremGenerator?.dispose()
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
    renderer.value?.render(scene, camera)
  }

  // Set the quality of the render, may be used for to change shadow quality for exemple
  const pixelRatio = quality === QUALITIES.HIGH ? 2 : 1
  renderer.value?.setPixelRatio(pixelRatio)

  /**
   * Resize to fit given size
   */
  const onResize = () => {
    const width = canvas?.value?.clientWidth || 0
    const height = canvas?.value?.clientHeight || 0

    cameraResize(width, height)
    renderer.value?.setSize(width, height)
  }

  /**
   * Add orbit controls
   */
  const addOrbitControls = () => {
    import('three/addons/controls/OrbitControls.js').then(rs => {
      const controls = new rs.OrbitControls(camera, canvas.value)
      controls.update()
    })
  }

  onMounted(() => {
    renderer.value = new WebGLRenderer({ canvas: canvas.value })

    pmremGenerator = new PMREMGenerator(renderer.value)
    pmremGenerator.compileCubemapShader()
    // Observer
    gsap.ticker.add(onTick)
    window.addEventListener("resize", onResize)
    onResize()
  })

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  onUnmounted(() => {
    gsap?.ticker?.remove(onTick)
    window.removeEventListener("resize", onResize)

    renderer.value?.dispose()
    sceneDispose()
  })

  return {
    scene,
    renderer,
    camera,
    addEnvmap,
    addOrbitControls,
  }
}
