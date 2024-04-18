<template>
  <div class="Page">
    <canvas
      ref="canvas"
      class="Page-canvas"
    />
  </div>
</template>

<script setup>
import { Mesh, PlaneGeometry, ShaderMaterial, Uniform } from 'three';

import fragment from "@/assets/flowmap/fragment.glsl"
import vertex from "@/assets/flowmap/vertex.glsl"

// Data
const canvas = ref()

/**
 * @type {import('../../src/runtime/composables/corgi').UseCorgi}
 */
const corgi = useCorgi(canvas)
const flowmap = useFlowmap(canvas, corgi, { debug: false })


// Lifecycle
onMounted(() => {
  corgi.camera.position.set(0, 0, 3)
  corgi.addOrbitControls()

  // console.info(flowmap.texture.value)
  const plane = new Mesh(
    new PlaneGeometry(2, 2, 16, 16),
    new ShaderMaterial(
      {
        uniforms: {
          uFlowmap: new Uniform(flowmap.texture.value),
        },
        fragmentShader: fragment,
        vertexShader: vertex,
      }
    )
  )

  corgi.scene.add(plane)
})



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
