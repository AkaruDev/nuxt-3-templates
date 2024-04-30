<template>
  <div
    ref="el"
    class="CorgiComponent"
    :style="{ aspectRatio }"
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

const aspectRatio = ref()

onMounted(async () => {
  component.value = components.add(el.value, props.mesh)
  aspectRatio.value = component.value.aspectRatio
})

onBeforeUnmount(() => {
  if (!component.value) return
  components.remove(component.value)
})

</script>


<style scoped>
.CorgiComponent {
  width: 100%;
}
</style>
