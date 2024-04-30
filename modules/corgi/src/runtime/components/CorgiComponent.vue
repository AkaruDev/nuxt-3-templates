<template>
  <div
    ref="el"
    class="CorgiComponent"
  />
</template>

<script setup>
import { Mesh } from 'three'

const props = defineProps({
  mesh: {
    type: Mesh,
    default: undefined
  },
})

const el = ref()
/**
 * @type {import('../composables/corgi-components').CorgiComponents}
 */
const components = useCorgiComponents()

/**
 * @type {import('../composables/corgi-components').CorgiComponent}
 */
const component = ref()

onBeforeUnmount(() => {
  if (!component.value) return
  components.remove(component.value)
})

watch(() => props.mesh, () => {
  if (props.mesh && !component.value && el.value) {
    component.value = components.add(el.value, props.mesh)
    el.value.style.aspectRatio = component.value.aspectRatio
  }
})

</script>


<style scoped>
.CorgiComponent {
  width: 100%;
}
</style>
