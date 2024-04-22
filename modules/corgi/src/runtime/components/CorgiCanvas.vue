<template>
  <canvas
    ref="el"
    class="CorgiCanvas"
  />
</template>

<script setup>
import { Vector3, Color } from "three";
import { RESOURCES_TYPES } from '../utils/types'

const props = defineProps({
  envmap: {
    type: String,
    default: undefined,
    // TODO add validator for string with '.exr'
  },
  gltf: {
    type: String,
    default: undefined,
    // TODO add validator for string with '.glb','gltf'
  },
  cameraPosition: {
    type: Vector3,
    default: () => new Vector3(0, 0, 3)
  },
  orbitControls: {
    type: Boolean,
    default: true,
  },
  enableZoom: {
    type: Boolean,
    default: false,
  },
  enablePan: {
    type: Boolean,
    default: false,
  },
  showEnvmap: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    type: Color,
    default: undefined,
  }
})

// Data
const el = ref()
/**
 * @type {import('../composables/corgi').UseCorgi}
*/
const corgi = useCorgi(el, props.backgroundColor)
const resources = useResources()

// Lifecycle
onMounted(() => {
  corgi.camera.position.set(props.cameraPosition.x, props.cameraPosition.y, props.cameraPosition.z)
  if (props.orbitControls) corgi.addOrbitControls(props.enableZoom, props.enablePan)

  if (props.envmap) resources.add(useResource('envmap', props.envmap, RESOURCES_TYPES.EXR))
  if (props.gltf) resources.add(useResource('model', props.gltf, RESOURCES_TYPES.GLTF))

  resources.getAll().then(items => {
    items.forEach(item => {
      if (item.type === RESOURCES_TYPES.EXR) {
        corgi.addEnvmap(item.asset, props.showEnvmap)
      }
      if (item.type === RESOURCES_TYPES.GLTF) {
        corgi.scene.add(item.asset.scene)
      }
    })
  })
})
// TODO watch props to change dynamicly the render params
// TODO maybe expose method to animate models
</script>

<style scoped>
.CorgiCanvas {}
</style>
