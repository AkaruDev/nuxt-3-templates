<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <h2>Slider draggable infinite:</h2>
    <AppSlider
      class="Slider"
      :items="items"
      @slider:update="onUpdate"
    >
      <template #item="{ item, i }">
        <div
          :id="`item-${i}`"
          class="Slider-item"
        >
          {{ item.label }}
        </div>
      </template>
    </AppSlider>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { InertiaPlugin } from '../gsap/InertiaPlugin'

gsap.registerPlugin(InertiaPlugin)

const items = []
for (let i = 0; i < 5; i++) {
  items.push({ id: i, label: `slider-${i}` })
}

const onUpdate = ({ slides }) => { // { progress, slides }
  slides.forEach(({ el, progress }) => {
    const division = 1 / slides.length
    const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(division * 2, division * 3, 0, 1, progress))
    el.style.setProperty('--progress', p)
  })
}

// TODO test prev/next

</script>

<style scoped>
.Page {
  min-height: 300vh;

  overflow: hidden;
}

.Page h2 {
  margin-top: 100px;
}

.AppSlider.Slider {
  width: 100%;

  margin-top: 50px;
}

.Slider-item {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 40vw;
  height: 500px;

  margin: 0 0 0 2vw;


  background-color: #fff3a4;
  color: #121212;

  transform: scale(calc((var(--progress, 0) * -0.5) + 1));
}
</style>
