<template>
  <canvas
    ref="el"
    class="CorgiCanvas"
  />
</template>

<script setup>
import useCorgi from "../composables/corgi"
import { useResizeObserver } from '@vueuse/core'
import { gsap } from "gsap"

// Data
const el = ref()
let corgi = null

// Lifecycle
onMounted(() => {
  corgi = useCorgi(el.value)

  useResizeObserver(el.value, onResize)

  gsap?.ticker?.add(onTick)
})


onUnmounted(() => {
  gsap?.ticker?.remove(onTick)
})

// Methods
const onTick = (time) => {
  corgi?.render(time)
}

const onResize = () => {
  const width = el?.value?.clientWidth || 0
  const height = el?.value?.clientHeight || 0

  corgi?.resize(width, height)
}

</script>

<style scoped>
.CorgiCanvas {
  width: 100%;
  height: 100%;
}
</style>
