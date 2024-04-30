<template>
  <canvas
    ref="canvas"
    class="CorgiComponents"
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
const canvas = ref()
/**
 * @type {import('../composables/corgi-components').CorgiComponents}
*/
const components = useCorgiComponents()
const resources = useResources()

// TODO check route change to remove planes of current route

// Lifecycle
onMounted(() => {
  components.mount(canvas, props)
  if (props.envmap) {
    resources.add(useResource('envmap', props.envmap, RESOURCES_TYPES.EXR))
    resources.get('envmap').then(envmap => {
      components.addEnvmap(envmap.asset, props.showEnvmap)
    })
  }

})

onUnmounted(() => {
  components.unmount()
})

</script>

<style scoped>
.CorgiComponents {
  position: fixed;
  width: 100vw;
  height: 100vh;

  top: 0;
  left: 0;

  pointer-events: none;

  z-index: 99;
}
</style>
