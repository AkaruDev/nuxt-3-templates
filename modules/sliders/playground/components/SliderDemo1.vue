<template>
  <div class="SliderDemo">
    <h2>Slider draggable infinite:</h2>
    <AppSlider
      ref="slider"
      class="Slider"
      :items="items"
      :has-snap="true"
      :offset-factor="1"
      :autoplay="false"
      @ready="onReady"
      @change="onChange"
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
      class="SliderBullets"
      :length="items.length"
      :index="index"
      @bullet:click="onClickBullet"
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

const onChange = (data) => { // { index,progress, slides }
  data.slides.forEach(({ progress }, index) => {
    if (tls[index]) {
      tls[index].progress(progress)
    }
  })

  index.value = data.index
}

const tls = []
const onReady = (slides) => {

  const step = (1 / slides.length)
  slides.forEach(slide => {
    const tl = gsap.timeline({ paused: true })
    const target = slide.el.querySelector('.Slider-item')
    const rotate = 2
    tl.set(target, { rotateY: rotate }, 0)
    tl.fromTo(target, { rotateY: rotate }, { rotateY: 0, duration: step, ease: "power3.inOut" }, step)
    tl.fromTo(target, { rotateY: 0 }, { rotateY: -rotate, duration: step, ease: "power3.inOut" }, step * 2)
    tl.set({}, {}, 1)
    tls.push(tl)
  })
}

const onClickBullet = (index) => {
  slider?.value?.goTo(index)
}

const next = () => {
  slider?.value?.next()
}
const prev = () => {
  slider?.value?.prev()
}

</script>

<style scoped>
.SliderDemo {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin-top: 200px;
}

.AppSlider.Slider {
  width: 100%;

  margin-top: 50px;

  margin-left: -3.33vw;
}

.AppSlider.Slider:deep(.AppSlider-item) {
  perspective: 400px;
}

.Slider-item {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 31vw;
  height: 31vw;

  margin: 0 0 0 2.33vw;

  border-radius: 13px;
  background-color: #e2d7fd;
  color: #121212;

}

.AppBullets.SliderBullets {
  margin-top: 20px;
}

.SliderNav {
  display: flex;

  margin-top: 30px;

  gap: 10px;
}
</style>
