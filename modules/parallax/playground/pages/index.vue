<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <div
      ref="parllax1"
      v-parallax="{ onProgress, offsetY }"
      class="Parallax"
    >
      {{ progress }}
    </div>
    <div
      id="parallax-2"
      v-parallax="{ normalised: true }"
      class="Parallax"
      :style="{ backgroundColor: '#feeed3' }"
    />
    <div
      v-parallax="{ active }"
      class="Parallax"
      :style="{ backgroundColor: '#d3fef7' }"
      @click="toggleActive"
    >
    click me to active/deactivate parallax
    </div>
  </div>
</template>

<script setup>

import { useWindowSize } from '@vueuse/core'

const { height } = useWindowSize()

const offsetY = ref(height.value * -0.5)

const parllax1 = ref()
const progress = ref(0)

const active = ref(false)
const toggleActive = () => {
  active.value = !active.value
}

const onProgress = ({ el, lerp }) => {
  if (parllax1.value === el) {
    progress.value = lerp
  }
}

onMounted(() => {
  window.addEventListener("resize", onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize)
})

const onResize = () => {
  offsetY.value = height.value * -0.5
}

</script>

<style scoped>
.Page {
  position: relative;
  justify-content: flex-start;
  height: auto;

  gap: 100px;

  padding-bottom: 100vh;

  overflow: hidden;
}

.Parallax {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 25vw;
  aspect-ratio: 1;

  background-color: #f1d3fe;
  color: black;

  transform: scaleX(calc((var(--px-progress, 0) * 1.5) + 1));
}

#parallax-2 {
  transform: translateX(calc((var(--px-progress, 0) * 100) * 1%));
}
</style>
