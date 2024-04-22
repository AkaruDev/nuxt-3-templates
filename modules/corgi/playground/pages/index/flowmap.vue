<template>
  <div class="Page">
    <canvas
      ref="canvas"
      class="Page-canvas"
    />
  </div>
</template>

<script setup>
import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial, Uniform } from 'three';

import fragment from "@/assets/flowmap/fragment.glsl"
import vertex from "@/assets/flowmap/vertex.glsl"
import { useWindowResize } from '../../../src/runtime/composables/window-resize';

// Data
const canvas = ref()
let plane = null

/**
 * @type {import('../../src/runtime/composables/corgi').UseCorgi}
 */
const corgi = useCorgi(canvas)
const flowmap = useFlowmap(corgi, { aspect: 1, debug: false, size: 128 * 2, radius: 0.2, dissipation: 0.98 })

// Lifecycle
onMounted(() => {
  corgi.camera.position.set(0, 0, 3)
  corgi.addOrbitControls()

  const size = corgi.getSize()
  flowmap.setAspect(size.width / size.height)

  plane = new Mesh(
    new PlaneGeometry(size.width, size.height, 16, 16),
    new ShaderMaterial(
      {
        side: DoubleSide,
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

const onResize = () => {
  if (plane) {
    const size = corgi.getSize()
    plane.geometry.dispose()
    plane.geometry = new PlaneGeometry(size.width, size.height, 128, 128)
    flowmap.setAspect(size.width / size.height)
  }
}
useWindowResize(onResize)

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
