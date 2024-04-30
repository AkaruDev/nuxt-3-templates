import { useScene } from "./scene"
import { ref } from "vue"
import { Box3, PMREMGenerator, PerspectiveCamera, Vector2, Vector3, Vector4, WebGLRenderer } from "three"
import { gsap } from "gsap"
import { isProxy, toRaw } from 'vue'

/**
 * @typedef {Object} CorgiComponents
 * @property {function} add - add components
 * @property {function} addEnvmap - add environement map
 * @property {function} addOrbitControls - add orbit controls
 * @property {boolean} canRender - Can the render be done ?
 * @property {function} getSize - Return camera width & height
 * @property {function} mount - Init the canvas and the listeners
 * @property {ref<import('three').WebGLRenderer>} renderer - Renderer
 * @property {function} remove - Remove a component from the scene
 * @property {function} removeByElement - Find a component by its element and remove it from the scene
 * @property {function} unmount - Dispose and remove canvas rendering
 */

/**
 * @typedef {Object} CorgiComponent
 * @property {Number} aspectRatio - Aspect ratio of the component
 * @property {import('three').Vector4} bounds - THREE.Vector4
 * @property {HTMLElement} element - HTMLElement
 * @property {import('three').Mesh} mesh - THREE.Mesh
 */

/**
 * Return the Corgi Components instance.
 * @returns {CorgiComponents}
 */
export const useCorgiComponents = (() => {

  /**
   * @type {ref<HTMLCanvasElement | OffscreenCanvas | void>}
   */
  const canvas = ref(null)
  const perspective = 2000

  let width = 0
  let height = 0
  /**
   * @type {CorgiComponent[]}
   */
  let components = []
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
  const camera = new PerspectiveCamera(50, 1, 1, perspective * 1.5)

  let resizeObserver = null

  // Methods
  /**
   * Add your environnement map helper
   * @param {import('three').DataTexture} texture - EXR texture from EXRLoader
   * @param {Boolean} showInBackground - Add texture to be visible in the scene
   */
  const addEnvmap = (texture, showInBackground = false) => {
    const envMap = pmremGenerator?.fromEquirectangular(texture).texture
    if (showInBackground) scene.background = envMap
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
    // On resize reset boundings/positions of components
    components.forEach(component => {
      set(component)
    })
  }

  const onResizeElement = (entries) => {
    entries.forEach(entry => {
      const component = getByElement(entry.target)
      if (!component) return
      set(component)
    })
  }

  const getSize = () => {
    camera.getViewSize(camera.position.z, size.value)
    return size.value
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {import('three').Mesh} mesh
   * @returns {CorgiComponent}
   */
  const add = (element, mesh) => {
    if (!element || components.find(component => component.element === element)) return
    if (isProxy(mesh)) mesh = toRaw(mesh)
    const component = { element, mesh, bounds: new Vector4(), size: null, aspectRatio: 1 }

    // Observe resize events
    resizeObserver?.observe(element)

    set(component)
    components.push(component)
    scene.add(component.mesh)

    render(true)

    return component
  }

  /**
   * Set dimensions and positions of the components
   * @param {CorgiComponent} component
   */
  const set = (component) => {
    const elementBounds = component.element.getBoundingClientRect()
    component.bounds.left = (elementBounds.left - width * 0.5 + elementBounds.width * 0.5) * camera.aspect
    component.bounds.top = (-(elementBounds.top + (container?.scrollTop || 0)) + height * 0.5 - elementBounds.height * 0.5) * camera.aspect
    component.bounds.width = (elementBounds.width * camera.aspect)
    component.bounds.height = (elementBounds.height * camera.aspect)

    component.mesh.position.set(component.bounds.left, component.bounds.top, 0)

    component.size = component.size ? component.size : new Box3().setFromObject(component.mesh).getSize(new Vector3())
    // If element size is not 1,1 then divide bounds by size to fit element
    if (component.size.x !== 1 && component.size.y !== 1) {
      component.aspectRatio = component.size.x / component.size.y
      component.mesh.scale.set(
        component.bounds.width / component.size.x,
        component.bounds.height / component.size.y,
        component.bounds.width / component.size.x,
      )
    } else {
      component.aspectRatio = component.bounds.width / component.bounds.height
      component.mesh.scale.set(component.bounds.width, component.bounds.height, 1)
    }

  }

  /**
   * Remove one component and dispose of it
   * @param {CorgiComponent} component
   * @returns
   */
  const remove = (component) => {
    if (isProxy(component)) component = toRaw(component)
    scene.remove(component.mesh)
    component.mesh.geometry.dispose()
    cleanMaterial(component.mesh.material)
    components = components.filter(item => item.element !== component.element)

    resizeObserver.unobserve(component.element)
  }

  const removeByElement = (element) => {
    const component = getByElement(element)
    if (!component) return
    scene.remove(component.mesh)
    component.mesh.geometry.dispose()
    cleanMaterial(component.mesh.material)
    components = components.filter(item => item !== component)
  }

  /**
   * Remove and dispose of all components
   */
  const removeAll = () => {
    components.forEach(component => {
      remove(component)
    })
    components = []
  }

  const getByElement = (element) => {
    return components.find(component => component.element === element)
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
   */
  const mount = (_canvas) => {
    if (canvas.value) return console.warn("Canvas already exist. Mount should be called only once.")
    container = document.querySelector(".corgi-scroll-container")
    canvas.value = _canvas.value

    // Renderer
    renderer.value = new WebGLRenderer({
      canvas: canvas.value,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
    })
    renderer.value?.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Environnement map utils
    pmremGenerator = new PMREMGenerator(renderer.value)
    pmremGenerator.compileCubemapShader()

    // Resize
    window.addEventListener("resize", onResize, { passive: true })
    onResize()
    resizeObserver = new ResizeObserver(onResizeElement)
    // Scroll
    container.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    // Ticker
    gsap.ticker.add(onTick)
  }

  /**
   * Remove all event listener, clear all that need to be cleaned (textures etc)
   */
  const unmount = () => {
    resizeObserver?.disconnect()
    canRender = false
    window.removeEventListener("resize", onResize)
    container.removeEventListener("scroll", onScroll)
    gsap.ticker.remove(onTick)
    removeAll()
    renderer.value?.dispose()
    sceneDispose()
  }

  return () => {

    return {
      add,
      addEnvmap,
      canRender,
      getSize,
      getByElement,
      mount,
      remove,
      removeByElement,
      renderer,
      unmount,
    }
  }
})()
