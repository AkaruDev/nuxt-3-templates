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
export const useFlowmap = (corgi, options) => {
  let isInit = false
  let gpgpu = null
  let particlesVariable = null

  let debugPlane = null

  const defaultOptions = {
    debug: false,
    aspect: 1,// Aspect ratio
    size: 128,// Size of the texture
    radius: 0.15,// Size of the stamp, percentage of the size
    alpha: 1.0,// Opacity of the stamp
    dissipation: 0.98,// Affects the speed that the stamp fades. Closer to 1 is slower
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

      // debugPlane.position.x = corgi.camera.position.z - 1
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
