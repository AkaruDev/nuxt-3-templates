<template>
  <canvas
    ref="el"
    class="CorgiCanvas"
  />
</template>

<script setup>
import { Vector3, Color, Object3D } from "three"
import { RESOURCES_TYPES } from '../utils/types'

const props = defineProps({
  envmap: {
    type: String,
    default: undefined,
    validator: (value) => value.includes('.exr')
  },
  model: {
    type: String,
    required: true,
    validator: (value) => value.includes('.gltf') || value.includes('.glb')
  },
  cameraPosition: {
    type: Vector3,
    default: () => new Vector3(0, 0, 0)
  },
  cameraRotation: {
    type: Vector3,
    default: () => new Vector3(0, 0, 0)
  },
  modelPosition: {
    type: Vector3,
    default: () => new Vector3(0, 0, 0)
  },
  modelRotation: {
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
  },
  pixelRatio: {
    type: Number,
    default: 1.5,
  },
})

// Data
const el = ref()
/**
 * @type {import('../composables/corgi').UseCorgi}
*/
const corgi = useCorgi(el, props)
const resources = useResources()
const scene = ref(new Object3D())

// Lifecycle
onMounted(() => {
  if (props.envmap) resources.add(useResource('envmap', props.envmap, RESOURCES_TYPES.EXR))
  if (props.model) resources.add(useResource('model', props.model, RESOURCES_TYPES.GLTF))
  resources.getAll().then(items => {
    items.forEach(item => {
      if (item.type === RESOURCES_TYPES.EXR) {
        corgi.addEnvmap(item.asset, props.showEnvmap)
      }
      if (item.type === RESOURCES_TYPES.GLTF && item?.asset?.scene) {
        scene.value = item.asset.scene
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

watch(() => [props.modelPosition.x, props.modelPosition.y, props.modelPosition.z], ([x, y, z]) => {
  scene.value.position.set(x, y, z)
})

watch(() => [props.modelRotation.x, props.modelRotation.y, props.modelRotation.z], ([x, y, z]) => {
  scene.value.rotation.set(x, y, z)
})

</script>

<style scoped>
.CorgiCanvas {
  width: 100%;
  height: 100%;
}
</style>
