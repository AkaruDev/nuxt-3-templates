import { useScene } from "./scene"
import { ref } from "vue"
import { Mesh, PMREMGenerator, PerspectiveCamera, PlaneGeometry, Vector2, Vector4, WebGLRenderer } from "three"
import { gsap } from "gsap"
import { isProxy, toRaw } from 'vue'

/**
 * @typedef {Object} CorgiPlanes
 * @property {function} addEnvmap - add environement map
 * @property {function} addPlane - add plane
 * @property {boolean} canRender - Can the render be done ?
 * @property {function} getSize - Return camera width & height
 * @property {function} mount - Init the canvas and the listeners
 * @property {import('three').WebGLRenderer} renderer - Remove a plane from the scene
 * @property {function} removePlane - Remove a plane from the scene
 * @property {function} removePlaneByElement - Find a plane by its element and remove it from the scene
 * @property {function} unmount - Dispose and remove canvas rendering
 */

/**
 * @typedef {Object} CorgiPlane
 * @property {HTMLElement} element - HTMLElement
 * @property {import('three').Mesh} mesh - THREE.Mesh
 * @property {import('three').Vector4} bounds - THREE.Vector4
 */

/**
 * @typedef {Object} CorgiPlanesOptions
 * @property {import('three').Color} backgroundColor - THREE.Color
 * @property {boolean} showEnvmap - If envmap show it in the background
 * @property {number} pixelRatio - Pixel ratio for the renderer
 */

/**
 * Return the Corgi Planes instance.
 * @returns {CorgiPlanes}
 */
export const useCorgiPlanes = (() => {

  /**
   * @type {ref<HTMLCanvasElement | OffscreenCanvas | void>}
   */
  const canvas = ref(null)
  let options = {
    pixelRatio: 1.5,
  }
  const perspective = 1000

  let width = 0
  let height = 0
  /**
   * @type {CorgiPlane[]}
   */
  let planes = []
  const size = ref(new Vector2())
  let pmremGenerator = null
  let renderer = ref(null)

  const {
    scene,
    cleanMaterial,
    dispose: sceneDispose
  } = useScene()

  /**
   * @type {import('three').PerspectiveCamera}
   */
  const camera = new PerspectiveCamera(50, 1, 1, perspective * 1.2)

  // Methods
  /**
   * Add your environnement map helper
   * @param {import('three').DataTexture} texture - EXR texture from EXRLoader
   * @param {Boolean} showInBackground - Add texture to be visible in the scene
   */
  const addEnvmap = (texture, showInBackground = false) => {
    const envMap = pmremGenerator?.fromEquirectangular(texture).texture
    if (options.showEnvmap || showInBackground) scene.background = envMap
    scene.environment = envMap

    texture.dispose()
    pmremGenerator?.dispose()
  }

  let canRender = true
  const render = (force = false) => {
    if (canRender || force) {
      renderer.value?.render(scene, camera)
    }
  }

  // Tick
  let scrollY = 0
  const onTick = () => {
    const currentY = window.scrollY * camera.aspect
    if (scrollY === currentY) canRender = true
    render()
  }

  /**
   * Resize to fit given size
   */
  const onResize = () => {
    width = window.innerWidth || 0
    height = window.innerHeight || 0

    // Render resize
    renderer.value?.setSize(width, height)

    // Set camera position to have unit equivalent in pixel
    const fov = (180 * (2 * Math.atan(width / 2 / perspective))) / Math.PI
    camera.fov = fov
    camera.position.setZ(perspective)
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    getSize()

    // Set scroll position
    onScroll()
    // On resize reset boundings/positions of planes
    planes.forEach(plane => {
      setPlane(plane)
    })
  }

  const getSize = () => {
    camera.getViewSize(camera.position.z, size.value)
    return size.value
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {import('three').Material} material
   * @returns {CorgiPlane}
   */
  const addPlane = (element, material, widthSegments = 1, heightSegments = 1) => {
    if (!element || planes.find(plane => plane.element === element)) return
    const planeGeometry = new PlaneGeometry(1, 1, widthSegments, heightSegments)
    const plane = { element, mesh: new Mesh(planeGeometry, material), bounds: new Vector4(), material }
    // TODO maybe add resize observer and observe element to set plane bounds on change

    setPlane(plane)
    planes.push(plane)
    scene.add(plane.mesh)

    render(true)

    return plane
  }

  /**
   *
   * @param {CorgiPlane} plane
   */
  const setPlane = (plane) => {
    const elementBounds = plane.element.getBoundingClientRect()
    plane.bounds.left = (elementBounds.left - width * 0.5 + elementBounds.width * 0.5) * camera.aspect
    plane.bounds.top = (-(elementBounds.top + container.scrollTop) + height * 0.5 - elementBounds.height * 0.5) * camera.aspect
    plane.bounds.width = (elementBounds.width * camera.aspect)
    plane.bounds.height = (elementBounds.height * camera.aspect)

    plane.mesh.position.set(plane.bounds.left, plane.bounds.top, 0)
    plane.mesh.scale.set(plane.bounds.width, plane.bounds.height, 1)
  }

  /**
   * Remove one plane and dispose of it
   * @param {CorgiPlane} plane
   * @returns
   */
  const removePlane = (plane) => {
    if (isProxy(plane)) plane = toRaw(plane)
    scene.remove(plane.mesh)
    plane.mesh.geometry.dispose()
    cleanMaterial(plane.mesh.material)
    planes = planes.filter(item => item.element !== plane.element)
  }

  const removePlaneByElement = (element) => {
    const plane = getPlane(element)
    if (!plane) return
    scene.remove(plane.mesh)
    plane.mesh.geometry.dispose()
    cleanMaterial(plane.mesh.material)
    planes = planes.filter(item => item !== plane)
  }

  /**
   * Remove and dispose of all planes
   */
  const removeAllPlanes = () => {
    planes.forEach(plane => {
      removePlane(plane)
    })
    planes = []
  }

  const getPlane = (element) => {
    return planes.find(plane => plane.element === element)
  }

  const onScroll = () => {
    const currentY = container.scrollTop * camera.aspect
    if (scrollY !== currentY) {
      scrollY = currentY
      scene.position.y = scrollY
    }
  }


  // Lifecycle
  /**
   * @type {HTMLElement | void}
   */
  let container = null
  /**
   *
   * @param {ref<HTMLCanvasElement | OffscreenCanvas | void>} _canvas
   * @param {CorgiPlanesOptions} _options
   */
  const mount = (_canvas, _options) => {
    if (canvas.value) return console.warn("Canvas already exist. Mount should be called only once.")

    container = document.querySelector(".corgi-scroll-container")
    canvas.value = _canvas.value
    options = { ...options, ..._options }

    renderer.value = new WebGLRenderer({ canvas: canvas.value, antialias: true, alpha: true, powerPreference: "high-performance" })
    // Set the quality of the render, may be used for to change shadow quality for exemple
    renderer.value?.setPixelRatio(options.pixelRatio)

    pmremGenerator = new PMREMGenerator(renderer.value)
    pmremGenerator.compileCubemapShader()

    window.addEventListener("resize", onResize, { passive: true })
    onResize()
    container.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    gsap.ticker.add(onTick)
  }

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  const unmount = () => {
    canRender = false
    window.removeEventListener("resize", onResize)
    container.removeEventListener("scroll", onScroll)
    gsap.ticker.remove(onTick)
    removeAllPlanes()
    renderer.value?.dispose()
    sceneDispose()
  }

  return () => {

    return {
      addEnvmap,
      addPlane,
      canRender,
      getSize,
      getPlane,
      mount,
      removePlane,
      removePlaneByElement,
      renderer,
      unmount,
    }
  }
})()
