import fragment from '../shaders/flowmap.frag'
import { onMounted, onUnmounted, computed } from 'vue'
import { useNormalizedMouse } from './normalized-mouse'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'
import { Mesh, MeshBasicMaterial, PlaneGeometry, Uniform, Vector2 } from 'three'
import { gsap } from 'gsap'


// TODO apply camera rotation to the plane ?
// TODO Add with, height for size and auto calculate aspect ratio
// TODO add a resize method

/**
 *
 * @param {import('./corgi').UseCorgi} corgi
 */
export const useFlowmap = (canvas, corgi, options) => {
  let isInit = false
  let gpgpu = null
  let particlesVariable = null

  const defaultOptions = {
    debug: false,
    size: 128,// size of the texture
    radius: 0.15,// size of the stamp, percentage of the size
    alpha: 1.0,// opacity of the stamp
    dissipation: 0.98,// affects the speed that the stamp fades. Closer to 1 is slower
    ...options
  }
  const mouse = useNormalizedMouse(canvas)

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
      uAspect: new Uniform(1),
      uMouse: new Uniform(new Vector2(mouse.normalized.value.x, mouse.normalized.value.y)),
      uVelocity: new Uniform(new Vector2(0.5, 0.5)),
    }
    gpgpu.setVariableDependencies(particlesVariable, [particlesVariable])
    gpgpu.init()


    // Debug gpgpu texture
    if (defaultOptions.debug) {
      const plane = new Mesh(
        new PlaneGeometry(1, 1),
        new MeshBasicMaterial(
          {
            map: gpgpu.getCurrentRenderTarget(particlesVariable).texture
          }
        )
      )
      corgi.scene.add(plane)
    }
    isInit = true
    gsap.ticker.add(update)
  })

  onUnmounted(() => {
    gsap.ticker.remove(update)
    gpgpu?.dispose()
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

  return {
    texture
  }
}
