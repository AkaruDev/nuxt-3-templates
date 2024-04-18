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
import { AgXToneMapping } from 'three'

// Data
const canvas = ref()

/**
 * @type {import('../../src/runtime/composables/corgi').UseCorgi}
 */
const corgi = useCorgi(canvas)
const resources = useResources()

// Lifecycle
onMounted(() => {

  corgi.camera.position.set(0, 0, 5)
  corgi.addOrbitControls()

  corgi.renderer.value.toneMapping = AgXToneMapping

  resources.add(
    [
      useResource('envmap', '/envmap.exr', RESOURCES_TYPES.EXR),
    ]
  )

  resources.get('envmap').then((resource) => {
    corgi.addEnvmap(resource.asset)
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
