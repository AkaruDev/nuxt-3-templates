<template>
  <div class="Page">
    <canvas
      ref="canvas"
      class="Page-canvas"
    />
  </div>
</template>

<script setup>
import { AgXToneMapping, BufferAttribute, BufferGeometry, Color, Mesh, MeshBasicMaterial, PlaneGeometry, Points, ShaderMaterial, Uniform, Vector2 } from 'three'
import { RESOURCES_TYPES } from '../../../src/runtime/utils/types'
import { getPositionFromMesh } from '../../../src/runtime/utils/gltf'
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
 * @type {import('three').ShaderMaterial}
 */
let material = null
/**
 * @type {GPUComputationRenderer}
 */
let gpgpu = null
let gpgpuIsInit = false
let particlesVariable = null

// Lifecycle
onMounted(() => {

  corgi = useCorgi(canvas.value)

  corgi.camera.position.set(0, 0, 3)
  corgi.addOrbitControls()

  corgi.renderer.toneMapping = AgXToneMapping


  resources.add([
    useResource('fragment', import('@/assets/particles-flowfield/points.frag'), RESOURCES_TYPES.GLSL),
    useResource('vertex', import('@/assets/particles-flowfield/points.vert'), RESOURCES_TYPES.GLSL),
    useResource('particles', import('@/assets/particles-flowfield/particles.frag'), RESOURCES_TYPES.GLSL),
    useResource('model', 'suzanne.glb', RESOURCES_TYPES.GLTF),
  ])

  resources.getAll().then(resources => {
    const [fragmentResource, vertexResource, particlesFragmentResource, modelResource] = resources

    const suzanne = modelResource.asset.scene.getObjectByName("Suzanne")

    const position = getPositionFromMesh(suzanne)

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', position)

    /** GPU computation **/

    // Number of pixel needed to have enough rgb information for each vertex
    const count = geometry.attributes.position.count
    const size = Math.ceil(Math.sqrt(count))

    // Compute uv coordinates for each particle
    const particlesUvArray = new Float32Array(count * 2)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x
        const i2 = i * 2
        const uvX = (x + 0.5) / size
        const uvY = (y + 0.5) / size
        particlesUvArray[i2 + 0] = uvX;
        particlesUvArray[i2 + 1] = uvY;
      }
    }
    geometry.setAttribute('aParticlesUv', new BufferAttribute(particlesUvArray, 2))

    gpgpu = new GPUComputationRenderer(size, size, corgi.renderer)

    // Texture for the particles
    const particlesTexture = gpgpu.createTexture()
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const i3 = i * 3
      const i4 = i * 4

      // rgba based on geometry position
      particlesTexture.image.data[i4 + 0] = geometry.attributes.position.array[i3 + 0]
      particlesTexture.image.data[i4 + 1] = geometry.attributes.position.array[i3 + 1]
      particlesTexture.image.data[i4 + 2] = geometry.attributes.position.array[i3 + 2]
      particlesTexture.image.data[i4 + 3] = Math.random() // Alpha use for resetting the position
    }

    // Set texture to be rewrited
    particlesVariable = gpgpu.addVariable('uParticles', particlesFragmentResource.asset, particlesTexture)
    particlesVariable.material.uniforms.uTime = new Uniform(0)
    particlesVariable.material.uniforms.uDeltaTime = new Uniform(0)
    particlesVariable.material.uniforms.uBase = new Uniform(particlesTexture)
    gpgpu.setVariableDependencies(particlesVariable, [particlesVariable])

    // Init
    gpgpu.init()
    gpgpuIsInit = true

    // Debug gpgpu texture
    const plane = new Mesh(
      new PlaneGeometry(1, 1),
      new MeshBasicMaterial(
        {
          map: gpgpu.getCurrentRenderTarget(particlesVariable).texture
        }
      )
    )
    plane.position.x -= 1.5
    plane.position.y += 1
    corgi.scene.add(plane)

    material = new ShaderMaterial(
      {
        fragmentShader: fragmentResource.asset,
        vertexShader: vertexResource.asset,
        transparent: true,
        // blending: AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uTime: new Uniform(0),
          uSize: new Uniform(15),
          uColor: new Uniform(new Color("#798E7B")),
          uParticles: new Uniform(),
          uResolution: new Uniform(new Vector2(canvas.value.clientWidth, canvas.value.clientHeight)),
        }
      }
    )

    const points = new Points(geometry, material)
    // IF vertex move particles outside of models bounds you can make ask three to see them
    // particles.points.frustumCulled = false
    corgi.scene.add(points)
  })


  gsap.ticker.add(update)
})

onUnmounted(() => {
  gsap.ticker.remove(update)
  corgi?.unmount()
})

// Methods
const update = (time, deltaTime) => {
  if (!material) return
  material.uniforms.uTime.value = time

  if (!gpgpu || !gpgpuIsInit) return
  material.uniforms.uParticles.value = gpgpu.getCurrentRenderTarget(particlesVariable).texture
  particlesVariable.material.uniforms.uTime.value = time
  particlesVariable.material.uniforms.uDeltaTime.value = deltaTime * 0.001
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
