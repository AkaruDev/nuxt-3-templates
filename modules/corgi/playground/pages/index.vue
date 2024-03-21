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

  resources.add(
    [
      useResource('envmap', '/envmap.exr', RESOURCES_TYPES.EXR),
      useResource('suzanne', '/suzanne.glb', RESOURCES_TYPES.GLTF),
      useResource('suzanne-draco', '/suzanne-draco.glb', RESOURCES_TYPES.GLTF),
    ]
  )

  resources.get('envmap').then((resource) => {
    console.info(resource.asset)
    corgi.addEnvmap(resource.asset)
  })

  resources.get('suzanne').then((resource) => {
    const suzanne = getChild(resource.asset.scene, "Suzanne")
    corgi.scene.add(suzanne)
  })

  resources.get('suzanne-draco').then((resource) => {
    const suzanne = getChild(resource.asset.scene, "Suzanne")
    suzanne.position.x = 2
    corgi.scene.add(suzanne)
  })


  /* resources.getAll().then((resources) => {
    console.info(resources)
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
