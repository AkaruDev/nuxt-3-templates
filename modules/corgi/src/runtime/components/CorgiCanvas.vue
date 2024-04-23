<template>
  <canvas
    ref="el"
    class="CorgiCanvas"
  />
</template>

<script setup>
import { Vector3, Color } from "three"
import { RESOURCES_TYPES } from '../utils/types'

const props = defineProps({
  envmap: {
    type: String,
    default: undefined,
    // TODO add validator for string with '.exr'
  },
  model: {
    type: String,
    default: undefined,
    // TODO add validator for string with '.glb','gltf'
  },
  cameraPosition: {
    type: Vector3,
    default: () => new Vector3(0, 0, 0)
  },
  cameraRotation: {
    type: Vector3,
    default: () => new Vector3(0, 0, 0)
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
const corgi = useCorgi(el, props)
const resources = useResources()


// Lifecycle
onMounted(() => {
  if (props.envmap) resources.add(useResource('envmap', props.envmap, RESOURCES_TYPES.EXR))
  if (props.model) resources.add(useResource('model', props.model, RESOURCES_TYPES.GLTF))
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

watch(() => [props.cameraPosition.x, props.cameraPosition.y, props.cameraPosition.z], ([x, y, z]) => {
  corgi?.camera?.position?.set(x, y, z)
  corgi?.camera?.updateProjectionMatrix()
})

watch(() => [props.cameraRotation.x, props.cameraRotation.y, props.cameraRotation.z], ([x, y, z]) => {
  if (corgi?.orbitControls?.value) {
    console.warn("Cannot move camera rotation if orbitControls exist")
    return
  }
  corgi?.camera?.rotation?.set(x, y, z)
  corgi?.camera?.updateProjectionMatrix()
})

</script>

<style lang="css" scoped>
.CorgiCanvas {
  position: relative;
  width: 100%;
}
</style>
