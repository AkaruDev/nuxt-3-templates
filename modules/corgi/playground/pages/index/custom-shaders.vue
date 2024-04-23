<template>
  <div class="Page">
    <canvas
      ref="canvas"
      class="Page-canvas"
    />
  </div>
</template>

<script setup>
import { RESOURCES_TYPES } from '../../src/runtime/utils/types'
import { AgXToneMapping, Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { useTicker } from '../../../src/runtime/composables/ticker';

// Data
const canvas = ref()

/**
 * @type {import('../../src/runtime/composables/corgi').UseCorgi}
 */
const corgi = useCorgi(canvas)
let material = null
const resources = useResources()


// Lifecycle
onMounted(async () => {

  // Did not find a better way to import in vanilla
  // const CustomShaderMaterial = (await import('three-custom-shader-material/vanilla')).default

  corgi.camera.position.set(0, 0, 10)
  corgi.addOrbitControls()

  corgi.renderer.value.toneMapping = AgXToneMapping

  resources.add(
    [
      useResource('custom-fragment', import('@/assets/custom-shaders/fragment.glsl'), RESOURCES_TYPES.GLSL),
      useResource('custom-vertex', import('@/assets/custom-shaders/vertex.glsl'), RESOURCES_TYPES.GLSL),
    ]
  )

  resources.get(['custom-fragment', 'custom-vertex']).then((resources) => {
    const [fragmentShader, vertexShader] = resources
    const geometry = new PlaneGeometry(5, 5, 256, 256)
    material = new CustomShaderMaterial({
      baseMaterial: new MeshBasicMaterial({
        color: new Color("green"),
      }),
      uniforms: {
        uTime: { value: 0 }
      },
      fragmentShader: fragmentShader.asset,
      vertexShader: vertexShader.asset,
      side: DoubleSide,
    })

    const plane = new Mesh(geometry, material)
    corgi.scene.add(plane)

  })

})

// Methods
const update = (time) => {
  if (!material) return
  material.uniforms.uTime.value = time
}
useTicker(update)
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
