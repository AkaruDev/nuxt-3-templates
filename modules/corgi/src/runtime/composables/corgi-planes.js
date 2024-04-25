import { useScene } from "./scene"
import { ref } from "vue"
import { PMREMGenerator, PerspectiveCamera, Vector2, WebGLRenderer } from "three"
import gsap from "gsap"

/**
 * @typedef {Object} UseCorgiPlanes
 * @property {import('three').Scene} scene - THREE.Scene
 * @property {import('three').WebGLRenderer} renderer - THREE.WebGLRenderer
 * @property {import('three').PerspectiveCamera} camera - THREE.PerspectiveCamera
 * @property {function} getSize - Return camera width & height
 * @property {function} addEnvmap - add environement map
 */

/**
 * @typedef {Object} CorgiPlanesOptions
 * @property {import('three').Color} backgroundColor - THREE.Color
 * @property {boolean} showEnvmap - If envmap show it in the background
 * @property {number} pixelRatio - Pixel ratio for the renderer
 */

/**
 * Return the Corgi Planes instance
 * @param {ref<HTMLCanvasElement | OffscreenCanvas | void>} canvas
 * @param {CorgiPlanesOptions} options
 * @returns {UseCorgiPlanes}
 */
export const useCorgiPlanes = (() => {

  const canvas = ref(null)
  let options = {
    pixelRatio: 1.5,
  }

  const size = ref(new Vector2())

  const {
    scene,
    dispose: sceneDispose
  } = useScene()

  let renderer = ref(null)

  const camera = new PerspectiveCamera()

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

  /**
   * Resize to fit given size
   */
  const onResize = () => {
    const width = canvas?.value?.clientWidth || 0
    const height = canvas?.value?.clientHeight || 0

    // Set camera position to have unit equivalent in pixel
    const perspective = 800
    const fov = (180 * (2 * Math.atan(width * 0.5 / perspective))) / Math.PI
    camera.aspect = width / height
    camera.fov = fov
    camera.position.setZ(perspective)
    camera.updateProjectionMatrix()

    // Render resize
    renderer.value?.setSize(width, height)

    getSize()
  }


  const getSize = () => {
    camera.getViewSize(camera.position.z, size.value)
    // TODO maybe parse all planes to recalculate boundings and position of planes
    return size.value
  }

  let planes = []
  const addPlane = (element, material) => {
    if (planes.find(plane => plane.element === element)) return
    // TODO build threejs mesh plane
    planes.add({ element, material })
  }

  const removePlane = (element) => {
    planes = planes.filter(plane => plane.element !== element)
  }

  const removeAllPlanes = () => {
    // TODO if needed do dispose call here
    // TODO remove planes from scene
    planes = []
  }

  // Lifecycle
  const mount = (_canvas, _options) => {
    if (canvas.value) return console.warn("Canvas already exist. Mount should be called only once.")
    canvas.value = _canvas.value
    options = { ...options, ..._options }

    renderer.value = new WebGLRenderer({ canvas: canvas.value, alpha: true })
    // Set the quality of the render, may be used for to change shadow quality for exemple
    renderer.value?.setPixelRatio(options.pixelRatio)

    pmremGenerator = new PMREMGenerator(renderer.value)
    pmremGenerator.compileCubemapShader()

    window.addEventListener("resize", onResize)
    gsap.ticker.add(onTick)
    onResize()
  }

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  const unmount = () => {
    window.removeEventListener("resize", onResize)
    gsap.ticker.remove(onTick)
    removeAllPlanes()
    renderer.value?.dispose()
    sceneDispose()
  }

  // TODO method for adding plane with html element
  // TODO add method to apply scroll translation
  // TODO improve resize to resize correctly all the planes

  return () => {

    return {
      scene,
      canvas,
      renderer,
      camera,
      getSize,
      addEnvmap,
      addPlane,
      removePlane,
      canRender,
      mount,
      unmount,
    }
  }
})()
