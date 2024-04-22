import { useScene } from "./scene"
import { useCamera } from "./camera"
import { useWindowResize } from "./window-resize"
import { ref, onMounted, onUnmounted } from "vue"
import { QUALITIES } from "../utils/types"
import { gsap } from "gsap"
import { PMREMGenerator, Vector2, WebGLRenderer } from "three"

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
 * @param {import('three').Color | void} color
 * @param {ref<HTMLCanvasElement | OffscreenCanvas | void>} canvas
 * @returns {UseCorgi}
 */
export const useCorgi = (canvas, color, quality = 1) => {

  const size = ref(new Vector2())

  const {
    scene,
    dispose: sceneDispose
  } = useScene()
  if (color) scene.background = color

  let renderer = ref(null)

  const {
    camera,
    resize: cameraResize
  } = useCamera()

  const orbitControls = null

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

  const onTick = () => {
    render()
  }

  const render = () => {
    orbitControls?.update?.()
    renderer.value?.render(scene, camera)
  }

  /**
   * Resize to fit given size
   */
  const onResize = () => {
    const width = canvas?.value?.clientWidth || 0
    const height = canvas?.value?.clientHeight || 0

    cameraResize(width, height)
    renderer.value?.setSize(width, height)

    getSize()
  }
  useWindowResize(onResize)

  /**
   * Add orbit controls
   */
  const addOrbitControls = (enableZoom = true, enablePan = true) => {
    import('three/addons/controls/OrbitControls.js').then(rs => {
      const controls = new rs.OrbitControls(camera, canvas.value)
      controls.enableZoom = enableZoom
      controls.enablePan = enablePan
      controls.update()
    })
  }

  const getSize = () => {
    camera.getViewSize(camera.position.z, size.value)
    return size.value
  }

  // Lifecycle
  onMounted(() => {
    renderer.value = new WebGLRenderer({ canvas: canvas.value, alpha: color === undefined })

    // Set the quality of the render, may be used for to change shadow quality for exemple
    const pixelRatio = quality === QUALITIES.HIGH ? 2 : 1.5
    renderer.value?.setPixelRatio(pixelRatio)

    pmremGenerator = new PMREMGenerator(renderer.value)
    pmremGenerator.compileCubemapShader()
    // Observer
    gsap.ticker.add(onTick)
    onResize()
  })

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  onUnmounted(() => {
    gsap?.ticker?.remove(onTick)

    renderer.value?.dispose()
    sceneDispose()
  })

  return {
    scene,
    canvas,
    renderer,
    camera,
    getSize,
    addEnvmap,
    addOrbitControls,
  }
}
