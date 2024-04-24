import { useScene } from "./scene"
import { useWindowResize } from "./window-resize"
import { useTicker } from "./ticker"
import { useIntersectionObserver } from "./intersection-observer"
import { ref, onMounted, onUnmounted } from "vue"
import { OrthographicCamera, PMREMGenerator, Vector2, Vector3, WebGLRenderer } from "three"

/**
 * @typedef {Object} UseCorgiPlanes
 * @property {import('three').Scene} scene - THREE.Scene
 * @property {import('three').WebGLRenderer} renderer - THREE.WebGLRenderer
 * @property {import('three').OrthographicCamera} camera - THREE.PerspectiveCamera
 * @property {function} getSize - Return camera width & height
 * @property {function} addEnvmap - add environement map
 */

/**
 * @typedef {Object} CorgiPlanesOptions
 * @property {import('three').Color} backgroundColor - THREE.Color
 * @property {import('three').Vector3} cameraPosition - Position of the camera
 * @property {boolean} showEnvmap - If envmap show it in the background
 * @property {number} pixelRatio - Pixel ratio for the renderer
 */

/**
 * Return the Corgi Planes instance
 * @param {ref<HTMLCanvasElement | OffscreenCanvas | void>} canvas
 * @param {CorgiPlanesOptions} options
 * @returns {UseCorgiPlanes}
 */
export const useCorgiPlanes = ((canvas, options) => {

  options = {
    backgroundColor: undefined,
    cameraPosition: new Vector3(0, 0, 0),
    showEnvmap: false,
    pixelRatio: 1.5,
    ...options
  }

  const size = ref(new Vector2())

  const {
    scene,
    dispose: sceneDispose
  } = useScene()
  if (options.backgroundColor) scene.background = options.backgroundColor

  let renderer = ref(null)

  const camera = new OrthographicCamera()
  camera.position.set(options.cameraPosition.x, options.cameraPosition.y, options.cameraPosition.z)

  let pmremGenerator = null

  // Methods
  /**
   * Add your environnement map helper
   * @param {import('three').DataTexture} texture - EXR texture from EXRLoader
   * @param {Boolean} showInBacground - Add texture to be visible in the scene
   */
  const addEnvmap = (texture, showInBacground = true) => {
    const envMap = pmremGenerator?.fromEquirectangular(texture).texture
    if (options.showEnvmap || showInBacground) scene.background = envMap
    scene.environment = envMap

    texture.dispose()
    pmremGenerator?.dispose()
  }
  const render = () => {
    renderer.value?.render(scene, camera)
  }

  // Tick
  let canRender = true
  const onTick = () => {
    if (!canRender) return
    render()
  }
  useTicker(onTick)

  // Intersection observer
  useIntersectionObserver(canvas, () => {
    canRender = true
  }, () => {
    canRender = false
  })

  /**
   * Resize to fit given size
   */
  const onResize = () => {
    const width = canvas?.value?.clientWidth || 0
    const height = canvas?.value?.clientHeight || 0

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.value?.setSize(width, height)

    getSize()
  }
  useWindowResize(onResize)


  const getSize = () => {
    camera.getViewSize(camera.position.z, size.value)
    return size.value
  }

  // Lifecycle
  onMounted(() => {
    renderer.value = new WebGLRenderer({ canvas: canvas.value, alpha: options.backgroundColor === undefined })

    // Set the quality of the render, may be used for to change shadow quality for exemple
    renderer.value?.setPixelRatio(options.pixelRatio)

    pmremGenerator = new PMREMGenerator(renderer.value)
    pmremGenerator.compileCubemapShader()

    onResize()
  })

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  onUnmounted(() => {
    renderer.value?.dispose()
    sceneDispose()
  })

  // TODO method for adding plane with html element
  // TODO add method to apply scroll translation
  // TODO improve resize to resize correctly all the planes

  return {
    scene,
    canvas,
    renderer,
    camera,
    getSize,
    addEnvmap,
  }
})()
