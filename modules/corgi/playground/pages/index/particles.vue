<template>
  <div class="Page">
    <canvas
      ref="canvas"
      class="Page-canvas"
    />
  </div>
</template>

<script setup>
import { AdditiveBlending, AgXToneMapping, BufferGeometry, Color, Points, ShaderMaterial } from 'three'
import { RESOURCES_TYPES } from '../../../src/runtime/utils/types'
import { getPositionFromMesh } from '../../../src/runtime/utils/gltf'
import { gsap } from 'gsap'

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

// Lifecycle
onMounted(() => {

  corgi = useCorgi(canvas.value)

  corgi.camera.position.set(0, 0, 3)
  corgi.addOrbitControls()

  corgi.renderer.toneMapping = AgXToneMapping


  resources.add([
    useResource('fragment', import('@/assets/points.frag'), RESOURCES_TYPES.GLSL),
    useResource('vertex', import('@/assets/points.vert'), RESOURCES_TYPES.GLSL),
    useResource('model', 'suzanne.glb', RESOURCES_TYPES.GLTF),
  ])

  resources.getAll().then(resources => {
    const [fragmentResource, vertexResource, modelResource] = resources

    const suzanne = modelResource.asset.scene.getObjectByName("Suzanne")

    const position = getPositionFromMesh(suzanne)

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', position)

    material = new ShaderMaterial(
      {
        fragmentShader: fragmentResource.asset,
        vertexShader: vertexResource.asset,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 20 },
          uColor: { value: new Color("#798E7B") }
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
const update = (time) => {
  if (!material) return
  material.uniforms.uTime.value = time
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
