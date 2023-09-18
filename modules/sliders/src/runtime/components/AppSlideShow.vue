<template>
  <div
    ref="el"
    class="AppSlideShow"
    :class="{ '--inactive': items.length < 2 }"
  >
    <div class="AppSlideShow-items">
      <div
        v-for="(item, i) in items"
        :key="`${name}-item-${i}`"
        ref="slideItems"
        class="AppSlideShow-item"
        :class="{ '--selected': i === index }"
      >
        <slot
          name="item"
          :item="item"
          :i="i"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { loop } from '../utils/math'

import { useIntersectionObserver, useSwipe } from '@vueuse/core'

const props = defineProps({
  name: {
    type: String,
    default: 'slideshow'
  },
  items: {
    type: Array,
    default: () => []
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 8
  },
  delay: {
    type: Number,
    default: 0.3
  },
  swipe: {
    type: Boolean,
    default: true
  }
})

// Define emits events
const EVENT_CHANGE = 'change'
const EVENT_PROGRESS = 'progress'
const emit = defineEmits(['change', 'progress'])

// Refs
const el = ref()
const index = ref(0)
const slideItems = ref('items')
const pause = ref(true)
const progress = ref(0)

// Data
const directions = {
  forward: 1,
  backward: -1
}
const tls = {
  autoplay: gsap.timeline()
}

// Intersection Observer
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
  pause.value = false
  tls?.autoplay?.play()
}
const onLeave = () => {
  pause.value = true
  tls?.autoplay?.pause()
}

// Lifecycle
onUnmounted(() => {
  tls.autoplay.kill()
})

onMounted(() => {
  play(directions.forward)
})

// Methods
const play = (direction) => {
  tls?.autoplay?.kill()
  if (!props.autoplay || props.items.length < 2) {
    progress.value = 0
    emit(EVENT_PROGRESS, progress.value)
    return
  }
  tls.autoplay = gsap.timeline({
    paused: pause.value,
    onUpdate: () => {
      emit(EVENT_PROGRESS, progress.value)
    }
  })
    .fromTo(progress, { value: 0 }, { value: 1, duration: props.duration, ease: 'linear' }, props.delay)
    .call(() => {
      if (direction === directions.forward) {
        next()
      } else {
        prev()
      }
    }, null, '>')
}

// Nav
const next = () => {
  set(directions.forward)
}

const prev = () => {
  set(directions.backward)
}

const goTo = (value) => {
  index.value = value
  set()
}

const set = (direction = 0) => {
  const oldValue = index.value
  index.value += direction
  index.value = loop(index.value, 0, props.items.length - 1)
  emit(EVENT_CHANGE, { oldValue, newValue: index.value })
  play(direction)
}

// Swipe
const { direction } = useSwipe(el, {
  threshold: 20,
  onSwipeEnd () {
    if (!props.swipe) { return }
    if (direction.value === 'left') {
      next()
    }
    if (direction.value === 'right') {
      prev()
    }
  }
})

// Expose
defineExpose({ prev, next, goTo })

</script>

<style scoped>
.AppSlideShow {
  position: relative;
  width: 100%;

  touch-action: pan-y;
}

.AppSlideShow.--inactive {
  pointer-events: none;
  touch-action: none;
}

.AppSlideShow-items {
  position: relative;
  width: 100%;
  height: 100%;

  overflow: hidden;
}

.AppSlideShow-item {
  position: absolute;
  flex: none;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;
}
</style>
