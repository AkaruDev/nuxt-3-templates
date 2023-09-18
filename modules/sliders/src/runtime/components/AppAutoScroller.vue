<template>
  <!-- v-observe="{ onEnter, onLeave, once: false }" -->
  <div
    ref="el"
    class="AppAutoScroller"
  >
    <!-- Items -->
    <div
      ref="wrapper"
      class="AppAutoScroller-items"
    >
      <div
        v-for="(item, i) in items"
        ref="slideItems"
        :key="`${name}-item-${i}`"
        class="AppAutoScroller-item"
      >
        <slot
          name="item"
          :item="item"
          :i="i"
        />
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup>
import gsap from 'gsap';

import { useIntersectionObserver } from "@vueuse/core"

const props = defineProps({
  name: {
    type: String,
    default: 'autoscroll'
  },
  items: {
    type: Array,
    default: () => []
  },
  duration: {
    type: Number,
    default: 10
  },
  direction: {
    type: Number,
    default: 1,
    validator: (value) => [-1, 1].includes(value)
  },
  offsetFactor: {
    type: Number,
    default: 1
  },
})

// Data
const directions = {
  previous: 1,
  next: -1
}
let animation = gsap.timeline()
let itemWidth = 0
let itemHeight = 0
let slides = []
let total = 0
let wrap = null
let wrapWidth = 0
const el = ref()
const wrapper = ref()
const slideItems = ref()
const isInit = ref(false)
const isVisible = ref(false)

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  isInit.value = false
  window.removeEventListener('resize', onResize)
})


// Methods
useIntersectionObserver(
  el,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      onEnter()
    } else {
      onLeave()
    }
  },
)

const onEnter = () => {
  isVisible.value = true
  init()
  animation?.play()
}
const onLeave = () => {
  animation?.pause()
  isVisible.value = false
}

const init = () => {
  if (isInit.value) return

  setSlides()
  setAnimation()

  isInit.value = true
}


const setSlides = () => {
  if (props.items.length === 0) return

  // Reorder
  const itemsSorted = [...slideItems.value]
  const last = itemsSorted.pop()
  itemsSorted.unshift(last)

  total = itemsSorted.length
  wrapWidth = 0
  itemHeight = 0

  itemWidth = itemsSorted?.[0]?.offsetWidth || 0
  wrapWidth = itemWidth * total

  // Loop items and create slides object
  slides = []
  itemsSorted.forEach((item, i) => {

    item.setAttribute('data-index', i)

    const bounds = item.getBoundingClientRect()
    itemHeight = bounds.height > itemHeight ? bounds.height : itemHeight

    const slideProgress = (i + 1) / total
    const x = bounds.width * (i + 1)
    const position = { x }
    const slide = {
      el: item,
      bounds,
      slideProgress,
      position
    }

    gsap.set(item, { position: 'absolute', x: slide.position.x, })

    slides.push(slide)
  })

  gsap.set(el.value, { height: itemHeight })

  gsap.set(wrapper.value, {
    x: -itemWidth * props.offsetFactor
  })

  wrap = gsap.utils.wrap(0, wrapWidth)
}

const setAnimation = () => {
  animation.kill()
  animation = gsap.timeline({ paused: false, repeat: -1 })

  animation.to(slideItems.value, {
    duration: props.duration,
    x: `+=${wrapWidth * props.direction}`,
    ease: 'none',
    modifiers: {
      x: (x) => {
        return wrap(parseFloat(x)) + "px"
      }
    }
  })
}

const onResize = () => {
  setSlides()
  setAnimation()
}


// Expose
defineExpose({ directions })
</script>


<style scoped>
.AppAutoScroller {
  position: relative;
}

.AppAutoScroller-items {
  display: flex;
  width: 100%;
}
</style>
