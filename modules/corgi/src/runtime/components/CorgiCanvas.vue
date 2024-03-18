<template>
  <canvas
    ref="el"
    class="CorgiCanvas"
  />
</template>

<script setup>
import { useCorgi } from "../composables/corgi"

// Data
const el = ref()

/**
 * @type {import('../composables/corgi').UseCorgi}
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
  width: 100% !important;
  height: 100% !important;
}
</style>
