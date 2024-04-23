import { useScene } from "./scene"
import { useCamera } from "./camera"
import { useWindowResize } from "./window-resize"
import { useTicker } from "./ticker"
import { useIntersectionObserver } from "./intersection-observer"
import { ref, onMounted, onUnmounted } from "vue"
import { PMREMGenerator, Vector2, Vector3, WebGLRenderer } from "three"

/**
 * @typedef {Object} UseCorgi
 * @property {import('three').Scene} scene - THREE.Scene
 * @property {import('three').WebGLRenderer} renderer - THREE.WebGLRenderer
 * @property {import('three').PerspectiveCamera} camera - THREE.PerspectiveCamera
 * @property {Function} unmount - Remove all event listener, clear all that need to be cleaned (textures etc)
 */

/**
 * @typedef {Object} CorgiOptions
 * @property {import('three').Color} backgroundColor - THREE.Color
 * @property {import('three').Vector3} cameraPosition - Position of the camera
 * @property {import('three').Vector3} cameraRotation - Rotation of the camera
 * @property {boolean} orbitControls - Add orbit controls
 * @property {boolean} enableZoom - Enable zoom for the orbit controls
 * @property {boolean} enablePan - Enable pan for the orbit controls
 * @property {boolean} showEnvmap - If envmap show it in the background
 * @property {number} pixelRatio - Pixel ratio for the renderer
 */

/**
 * Return a new Corgi instance
 * @param {ref<HTMLCanvasElement | OffscreenCanvas | void>} canvas
 * @param {CorgiOptions} options
 * @returns {UseCorgi}
 */
export const useCorgi = (canvas, options) => {

  options = {
    backgroundColor: undefined,
    cameraPosition: new Vector3(0, 0, 0),
    cameraRotation: new Vector3(0, 0, 0),
    orbitControls: false,
    enableZoom: true,
    enablePan: false,
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

  const {
    camera,
    resize: cameraResize
  } = useCamera()
  camera.position.set(options.cameraPosition.x, options.cameraPosition.y, options.cameraPosition.z)
  camera.rotation.setFromVector3(options.cameraRotation)

  const orbitControls = ref(null)
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
    orbitControls.value?.update?.()
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

    cameraResize(width, height)
    renderer.value?.setSize(width, height)

    getSize()
  }
  useWindowResize(onResize)

  /**
   * Add orbit controls
   */
  const addOrbitControls = (enableZoom = true, enablePan = false) => {
    import('three/addons/controls/OrbitControls.js').then(rs => {
      orbitControls.value = new rs.OrbitControls(camera, canvas.value)
      orbitControls.value.enableZoom = enableZoom
      orbitControls.value.enablePan = enablePan
      orbitControls.value.update()
    })
  }

  const getSize = () => {
    camera.getViewSize(camera.position.z, size.value)
    return size.value
  }

  // Lifecycle
  onMounted(() => {
    renderer.value = new WebGLRenderer({ canvas: canvas.value, alpha: options.backgroundColor === undefined })

    // Set the quality of the render, may be used for to change shadow quality for exemple
    renderer.value?.setPixelRatio(options.pixelRatio)

    if (options.orbitControls) addOrbitControls(options.enableZoom, options.enablePan)

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

  return {
    scene,
    canvas,
    renderer,
    camera,
    getSize,
    addEnvmap,
    addOrbitControls,
    orbitControls,
  }
}
