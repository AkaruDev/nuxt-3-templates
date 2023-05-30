<template>
  <div class="SliderDemo">
    <h2>Slideshow:</h2>
    <AppSlideShow
      ref="slideshow"
      class="SlideShow"
      :items="items"
      @change="onChange"
      @progress="onProgress"
    >
      <template #item="{ item, i }">
        <div
          :id="`item-${i}`"
          :class="{ '--selected': i === index }"
          class="Slider-item"
        >
          {{ item.label }}
        </div>
      </template>
    </AppSlideShow>

    <div
      class="ProgressBar"
      :style="{ '--progress': progress }"
    />

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
const slideshow = ref('slideshow')
const index = ref(0)
const progress = ref(0)

const items = []
for (let i = 0; i < 5; i++) {
  items.push({ id: i, label: `slider-${i}` })
}

const onChange = ({ oldValue, newValue }) => {
  index.value = newValue
}

const onProgress = (value) => {
  progress.value = value
}

const onClickBullet = (index) => {
  slideshow?.value?.goTo(index)
}

const next = () => {
  slideshow?.value?.next()
}
const prev = () => {
  slideshow?.value?.prev()
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

.AppSlideShow.SlideShow {
  width: 40vh;
  height: 40vh;

  margin-top: 50px;

  background-color: #e2d7fd;
  border-radius: 13px;

  overflow: hidden;
}

.Slider-item {
  flex: none;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background-color: #e2d7fd;
  color: #121212;

  opacity: 0;
}

.Slider-item.--selected {
  opacity: 1;
  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
}

.ProgressBar {
  position: relative;
  width: calc(40vh - 20px);
  height: 3px;

  border-radius: 3px;
  background-color: #312451;

  margin-top: 20px;
}

.ProgressBar::after {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  transform-origin: 0;

  background-color: #e2d7fd;

  transform: scaleX(var(--progress, 0));

  content: '';
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

