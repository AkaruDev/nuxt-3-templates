<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <h2>Slider draggable infinite:</h2>
    <AppSlider
      ref="slider"
      class="Slider"
      :items="items"
      :has-snap="true"
      @slider:ready="onReady"
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

    <AppBullets
      :length="items.length"
      :index="index"
    />

    <div class="SliderNav">
      <button
        type="button"
        aria-label="Previous"
        @click="prev"
      >
        Prev
      </button>
      <button
        type="button"
        aria-label="Next"
        @click="next"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { InertiaPlugin } from '../gsap/InertiaPlugin'

gsap.registerPlugin(InertiaPlugin)

// Set slider
const slider = ref('slider')
const index = ref(0)

const items = []
for (let i = 0; i < 5; i++) {
  items.push({ id: i, label: `slider-${i}` })
}

const onUpdate = (data) => { // { index,progress, slides }
  data.slides.forEach(({ progress }, index) => {
    if (tls[index]) {
      tls[index].progress(progress)
    }
  })

  index.value = data.index
}

const tls = []
const onReady = (slides) => {
  const step = 1 / slides.length
  slides.forEach(slide => {
    const tl = gsap.timeline({ paused: true })
    const target = slide.el.querySelector('.Slider-item')
    tl.fromTo(target, { scale: 0.5 }, { scale: 1, duration: step, ease: "power3.out" }, 0)
    tl.fromTo(target, { scale: 1 }, { scale: 0.5, duration: step, ease: "power3.out" }, step * 2)
    tls.push(tl)
  })

}

const next = () => {
  slider?.value?.next()
}
const prev = () => {
  slider?.value?.prev()
}


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

  margin-left: -3.33vw;
}

.Slider-item {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 31vw;
  height: 31vw;

  margin: 0 0 0 2.33vw;


  background-color: #fdf8d7;
  color: #121212;

}

.SliderNav {
  display: flex;

  margin-top: 30px;

  gap: 10px;
}
</style>
