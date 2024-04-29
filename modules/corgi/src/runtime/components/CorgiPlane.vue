<template>
  <div
    ref="el"
    class="CorgiPlane"
  />
</template>

<script setup>
import { Material } from 'three'

const props = defineProps({
  material: {
    type: Material,
    required: true
  },
  widthSegments: {
    type: Number,
    default: 1,
  },
  heightSegments: {
    type: Number,
    default: 1,
  },
})

const el = ref()
/**
 * @type {import('../composables/corgi-planes').CorgiPlanes}
 */
const planes = useCorgiPlanes()

/**
 * @type {import('../composables/corgi-planes').CorgiPlane}
 */
const plane = ref()

onMounted(async () => {
  plane.value = planes.addPlane(el.value, props.material, props.widthSegments, props.heightSegments)
})

onBeforeUnmount(() => {
  if (!plane.value) return
  planes.removePlane(plane.value)
})

</script>

