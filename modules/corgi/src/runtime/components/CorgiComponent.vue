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
    required: true
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

onMounted(async () => {
  component.value = components.add(el.value, props.mesh)
})

onBeforeUnmount(() => {
  if (!component.value) return
  components.remove(component.value)
})

</script>

