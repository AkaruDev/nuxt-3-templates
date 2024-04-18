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
import { AgXToneMapping, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

// Data
const canvas = ref()

/**
 * @type {import('../../src/runtime/composables/corgi').UseCorgi}
 */
const corgi = useCorgi(canvas)
const resources = useResources()

// Lifecycle
onMounted(() => {

  corgi.camera.position.set(0, 0, 10)
  corgi.addOrbitControls()

  corgi.renderer.value.toneMapping = AgXToneMapping

  resources.add(
    [
      useResource('akaru', '/akaru-texture.png', RESOURCES_TYPES.IMAGE),
    ]
  )

  resources.get('akaru').then((resource) => {

    const geometry = new PlaneGeometry(5, 5)
    const material = new MeshBasicMaterial({
      map: resource.asset,
      side: DoubleSide,
    })
    const plane = new Mesh(geometry, material)
    corgi.scene.add(plane)
  })
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
