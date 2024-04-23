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
import { AgXToneMapping, DoubleSide, Mesh, PlaneGeometry, RawShaderMaterial } from 'three'
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
onMounted(() => {
  corgi.camera.position.set(0, 0, 10)
  corgi.addOrbitControls()

  corgi.renderer.value.toneMapping = AgXToneMapping

  resources.add(
    [
      useResource('fragment', import('@/assets/fragment.glsl'), RESOURCES_TYPES.GLSL),
      useResource('vertex', import('@/assets/vertex.glsl'), RESOURCES_TYPES.GLSL),
    ]
  )

  resources.get(['fragment', 'vertex']).then((resources) => {
    const [fragmentShader, vertexShader] = resources
    const geometry = new PlaneGeometry(5, 5)
    material = new RawShaderMaterial({
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
