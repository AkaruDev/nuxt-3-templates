<template>
  <div class="Home">
    <canvas
      ref="canvas"
      class="Home-canvas"
    />
    <article>
      <h1>Home</h1>
      <nuxt-link to="/page">
        Go to page
      </nuxt-link>
    </article>
  </div>
</template>

<script setup>
import { RESOURCES_TYPES } from '../../src/runtime/utils/types'
import { getChild } from '../../src/runtime/utils/gltf'
import { Color, AmbientLight } from "three"

// Data
const canvas = ref()

/**
 * @type {import('../../src/runtime/composables/corgi').UseCorgi}
 */
let corgi = null
const resources = useResources()

// Lifecycle
onMounted(() => {
  corgi = useCorgi(canvas.value)

  corgi.camera.position.set(0, 0, 5)

  corgi.scene.add(new AmbientLight(new Color("white"), 2))

  resources.add(
    [
      useResource('suzanne', '/suzanne.glb', RESOURCES_TYPES.gltf),
      useResource('suzanne-draco', '/suzanne-draco.glb', RESOURCES_TYPES.draco),
    ]
  )

  resources.get('suzanne', (resource) => {
    const suzanne = getChild(resource.asset.scene, "Suzanne")
    corgi.scene.add(suzanne)
  })

  /*
  // With promised version
  resources.get('suzanne').then((asset) => {
    const suzanne = getChild(asset.scene, "Suzanne")

    corgi.scene.add(suzanne)
  })
  */
})

onUnmounted(() => {
  corgi?.unmount()
})
</script>

<style scoped>
.Home {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  z-index: 0;
}

.Home article {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  gap: 10px;

  z-index: 1;
}

.Home-canvas {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  z-index: 0;
}
</style>
