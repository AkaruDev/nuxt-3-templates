<template>
  <div class="Page">
    <canvas
      ref="canvas"
      class="Page-canvas"
    />
  </div>
</template>

<script setup>
import { AgXToneMapping, Mesh, MeshBasicMaterial, PlaneGeometry, Uniform, Vector2, } from 'three'
import { RESOURCES_TYPES } from '../../../src/runtime/utils/types'
import { gsap } from 'gsap'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'

// Data
const canvas = ref()
const resources = useResources()

/**
 * @type {import('../../src/runtime/composables/corgi').UseCorgi}
 */
let corgi = null

/**
 * @type {GPUComputationRenderer}
 */
let gpgpu = null
let gpgpuIsInit = false
let particlesVariable = null

let mouse = null

// Lifecycle
onMounted(() => {
  mouse = useNormalizedMouse(canvas.value)

  corgi = useCorgi(canvas.value)

  corgi.camera.position.set(0, 0, 3)
  corgi.addOrbitControls()

  resources.add([
    useResource('fragment', import('@/assets/flowmap/flowmap.frag'), RESOURCES_TYPES.GLSL),
  ])

  resources.getAll().then(resources => {
    const [fragmentResource] = resources

    const size = 128

    gpgpu = new GPUComputationRenderer(size, size, corgi.renderer)
    // Set texture to be rewrited
    const particlesTexture = gpgpu.createTexture()
    particlesVariable = gpgpu.addVariable('uMap', fragmentResource.asset, particlesTexture)
    particlesVariable.material.uniforms = {
      ...particlesVariable.material.uniforms,
      uFalloff: new Uniform(0.2),// size of the stamp, percentage of the size
      uAlpha: new Uniform(1),// opacity of the stamp
      uDissipation: new Uniform(0.98),// affects the speed that the stamp fades. Closer to 1 is slower
      uAspect: new Uniform(1),
      uMouse: new Uniform(new Vector2(0.5, 0.5)),
      uVelocity: new Uniform(new Vector2(0.5, 0.5)),
    }
    gpgpu.setVariableDependencies(particlesVariable, [particlesVariable])
    gpgpu.init()
    gpgpuIsInit = true

    // Debug gpgpu texture
    const plane = new Mesh(
      new PlaneGeometry(2, 2),
      new MeshBasicMaterial(
        {
          map: gpgpu.getCurrentRenderTarget(particlesVariable).texture
        }
      )
    )
    corgi.scene.add(plane)
  })

  gsap.ticker.add(update)
})

onUnmounted(() => {
  gsap.ticker.remove(update)
  corgi?.unmount()
})

// Methods
const update = () => {
  if (!mouse || !particlesVariable) return;
  particlesVariable.material.uniforms.uMouse.value = mouse.normalized.value
  particlesVariable.material.uniforms.uVelocity.value = mouse.velocity.value
  if (!gpgpu || !gpgpuIsInit) return
  gpgpu.compute()


}

</script>

<style scoped>
.Page-canvas {
  position: absolute;
  width: 100% !important;
  height: 100% !important;

  top: 0;
  left: 0;

  z-index: 0;
}
</style>
