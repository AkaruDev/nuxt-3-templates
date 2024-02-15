<template>
  <canvas
    ref="el"
    class="CorgiCanvas"
  />
</template>

<script setup>
import useCorgi from "../composables/corgi"

// Data
const el = ref()
/**
 * @type {useCorgi}
 */
let corgi = null

// Lifecycle
onMounted(() => {
  corgi = useCorgi(el.value)
})

onUnmounted(() => {
  corgi?.unmount()
})

</script>

<style scoped>
.CorgiCanvas {
  width: 100%;
  height: 100%;
}
</style>
