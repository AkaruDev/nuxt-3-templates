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

  corgi.camera.position.set(0, 0, 4)
  corgi.addOrbitControls()

  corgi.renderer.value.toneMapping = AgXToneMapping

  resources.add(
    [
      useResource('envmap', '/envmap.exr', RESOURCES_TYPES.EXR),
      useResource('suzanne', '/suzanne.glb', RESOURCES_TYPES.GLTF),
      // useResource('suzanne-draco', '/suzanne-draco.glb', RESOURCES_TYPES.GLTF),
    ]
  )

  resources.get(['envmap', 'suzanne']).then((resources) => {
    const [envmapResource, modelResource] = resources
    corgi.addEnvmap(envmapResource.asset)

    const suzanne = modelResource.asset.scene.getObjectByName("Suzanne")
    corgi.scene.add(suzanne)
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
