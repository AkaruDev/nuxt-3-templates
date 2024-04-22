<template>
  <div class="Page">
    <canvas
      ref="canvas"
      class="Page-canvas"
    />
  </div>
</template>

<script setup>
import { Mesh, PlaneGeometry, ShaderMaterial, Uniform, Vector2 } from 'three';

import fragment from "@/assets/flowmap/fragment.glsl"
import vertex from "@/assets/flowmap/vertex.glsl"

// Data
const canvas = ref()

/**
 * @type {import('../../src/runtime/composables/corgi').UseCorgi}
 */
const corgi = useCorgi(canvas)
const flowmap = useFlowmap(corgi, { aspect: 1, debug: true, size: 128 * 2, radius: 0.2 })

// Lifecycle
onMounted(() => {
  corgi.camera.position.set(0, 0, 3)
  corgi.addOrbitControls()

  const size = corgi.getSize()
  flowmap.setAspect(size.width / size.height)

  const plane = new Mesh(
    new PlaneGeometry(size.width, size.height, 64, 64),
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
