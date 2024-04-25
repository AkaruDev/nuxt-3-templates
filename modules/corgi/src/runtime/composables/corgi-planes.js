import { useScene } from "./scene"
import { ref } from "vue"
import { Mesh, PMREMGenerator, PerspectiveCamera, PlaneGeometry, Vector2, Vector4, WebGLRenderer } from "three"
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

  const camera = new PerspectiveCamera(50, 1, 1, 800)

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


  let width = 0
  let height = 0
  /**
   * Resize to fit given size
   */
  const onResize = () => {
    width = canvas?.value?.clientWidth || 0
    height = canvas?.value?.clientHeight || 0


    // Render resize
    renderer.value?.setSize(width, height)

    // Set camera position to have unit equivalent in pixel
    const perspective = 800
    const fov = (180 * (2 * Math.atan(width / 2 / perspective))) / Math.PI
    camera.fov = fov
    camera.position.setZ(perspective)
    camera.aspect = width / height
    camera.updateProjectionMatrix()


    getSize()
  }


  const getSize = () => {
    camera.getViewSize(camera.position.z, size.value)
    // TODO maybe parse all planes to recalculate boundings and position of planes
    return size.value
  }

  let planes = []
  /**
   *
   * @param {HTMLElement} element
   * @param {import('three').Material} material
   * @returns
   */
  const addPlane = (element, material) => {
    if (planes.find(plane => plane.element === element)) return
    // TODO build threejs mesh plane

    const elementBounds = element.getBoundingClientRect()
    const plane = new Mesh(new PlaneGeometry(1, 1, 1, 1), material)

    const bounds = new Vector4()
    bounds.left = (elementBounds.left - width * 0.5 + elementBounds.width * 0.5) * camera.aspect
    bounds.top = (-elementBounds.top + height * 0.5 - elementBounds.height * 0.5) * camera.aspect
    bounds.width = elementBounds.width * camera.aspect
    bounds.height = elementBounds.height * camera.aspect

    plane.position.set(bounds.left, bounds.top, 0)
    plane.scale.set(bounds.width, bounds.height, 1)
    planes.push({ element, bounds, material })

    scene.add(plane)

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

    // TODO listen to scroll changes
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
