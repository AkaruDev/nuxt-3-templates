import fragment from '../shaders/flowmap.frag'
import { onMounted, onUnmounted, computed } from 'vue'
import { useNormalizedMouse } from './normalized-mouse'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'
import { Mesh, MeshBasicMaterial, PlaneGeometry, Uniform, Vector2 } from 'three'
import { gsap } from 'gsap'

/**
 * @typedef {Object} FlowmapOptions
 * @property {boolean} debug - Show debug plane in front of camera
 * @property {number} aspect - Aspect ratio to correct the stamp roundness
 * @property {number} size - Size of the texture
 * @property {number} radius - Size of the stamp in percentage of the texture
 * @property {number} alpha - Opacity of the stamp
 * @property {number} dissipation - Affects the speed that the stamp fades. Closer to 1 is slower
 */

/**
 * @typedef {Object} UseFlowmap
 * @property {function} setAspect - Method for correcting the aspect ratio of the stamp
 * @property {import('three').Mesh | void} debugPlane - If debug true then return the mesh that is used for debugging visually the flowmap
 * @property {import('three').Texture} texture - Texture of the flow
 */

/**
 * Use GPU computation to create a flow texture following the mouse move.
 * @param {import('./corgi').UseCorgi} corgi
 * @param {FlowmapOptions} options
 * @returns {UseFlowmap}
 */
export const useFlowmap = (corgi, options) => {
  let isInit = false
  let gpgpu = null
  let particlesVariable = null

  let debugPlane = null

  /**
   * @type {FlowmapOptions}
   */
  const defaultOptions = {
    debug: false,
    aspect: 1,
    size: 128,
    radius: 0.15,
    alpha: 1.0,
    dissipation: 0.98,
    ...options
  }
  const mouse = useNormalizedMouse(corgi.canvas)

  onMounted(() => {
    gpgpu = new GPUComputationRenderer(defaultOptions.size, defaultOptions.size, corgi.renderer.value)
    // Set texture to be rewrited
    const particlesTexture = gpgpu.createTexture()
    particlesVariable = gpgpu.addVariable('uMap', fragment, particlesTexture)
    particlesVariable.material.uniforms = {
      ...particlesVariable.material.uniforms,
      uFalloff: new Uniform(defaultOptions.radius),// size of the stamp, percentage of the size
      uAlpha: new Uniform(defaultOptions.alpha),// opacity of the stamp
      uDissipation: new Uniform(defaultOptions.dissipation),// affects the speed that the stamp fades. Closer to 1 is slower
      uAspect: new Uniform(defaultOptions.aspect),
      uMouse: new Uniform(new Vector2(mouse.normalized.value.x, mouse.normalized.value.y)),
      uVelocity: new Uniform(new Vector2(0.5, 0.5)),
    }
    gpgpu.setVariableDependencies(particlesVariable, [particlesVariable])
    gpgpu.init()


    // Debug gpgpu texture
    if (defaultOptions.debug) {
      debugPlane = new Mesh(
        new PlaneGeometry(0.25, 0.25),
        new MeshBasicMaterial(
          {
            map: gpgpu.getCurrentRenderTarget(particlesVariable).texture
          }
        )
      )
      debugPlane.position.z = corgi.camera.position.z - 1
      corgi.camera.add(debugPlane)
      corgi.scene.add(corgi.camera)
    }
    isInit = true
    gsap.ticker.add(update)
  })

  const update = () => {
    if (!isInit) return
    particlesVariable.material.uniforms.uMouse.value = mouse.normalized.value
    particlesVariable.material.uniforms.uVelocity.value = mouse.velocity.value
    gpgpu?.compute()
  }

  const texture = computed(() => {
    return gpgpu.getCurrentRenderTarget(particlesVariable).texture
  })

  const setAspect = (value) => {
    if (!isInit) return
    particlesVariable.material.uniforms.uAspect.value = value
  }

  onUnmounted(() => {
    gsap.ticker.remove(update)
    gpgpu?.dispose()
  })

  return {
    setAspect,
    debugPlane,
    texture
  }
}
