<template>
  <canvas
    ref="el"
    class="CorgiPlanes"
  />
</template>

<script setup>
import { RESOURCES_TYPES } from '../utils/types'

const props = defineProps({
  envmap: {
    type: String,
    default: undefined,
    validator: (value) => value.includes('.exr')
  },
  pixelRatio: {
    type: Number,
    default: 1.5,
  },
})

// Data
const el = ref()
/**
 * @type {import('../composables/corgi-planes').UseCorgiPlanes}
*/
const planes = useCorgiPlanes()
const resources = useResources()

// TODO check route change to remove planes of current route

// Lifecycle
onMounted(() => {
  planes.mount(el, props)

  if (props.envmap) {
    resources.add(useResource('envmap', props.envmap, RESOURCES_TYPES.EXR))
    resources.get('envmap').then(envmap => {
      planes.addEnvmap(envmap.asset, props.showEnvmap)
    })
  }
})

onUnmounted(() => {
  planes.unmount()
})

</script>

<style scoped>
.CorgiPlanes {
  position: fixed;
  width: 100vw !important;
  height: 100vh !important;

  top: 0;
  left: 0;

  pointer-events: none;

  z-index: 99;
}
</style>
