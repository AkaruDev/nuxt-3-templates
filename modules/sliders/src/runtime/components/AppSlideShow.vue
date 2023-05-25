<template>
  <div
    class="AppSlider"
    :class="{ '--inactive': items.length < 2 }"
  >
    <div class="AppSlider-items">
      <div
        v-for="(item, i) in items"
        :key="`${name}-item-${i}`"
        ref="items"
        class="AppSlider-item"
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
    default: 1
  },
  delay: {
    type: Number,
    default: 5
  },
  swipe: {
    type: Boolean,
    default: true
  }
})

// TODO find how to animate that from outside, timeline props for from/to ?

// Define emits events
const EVENT_CHANGE = 'change'
const EVENT_PROGRESS = 'progress'
const emit = defineEmits(['change', 'progress'])

// Refs
const items = ref('items')
const progress = ref(0)

// Data
const directions = {
  forward: -1,
  backward: 1
}
const index = 0
const pause = true
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
  pause = false
  tls?.autoplay?.play()
}
const onLeave = () => {
  pause = true
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
  if (!props.autoplay || items.length < 2) {
    progress.value = 0
    emit(EVENT_PROGRESS, progress.value)
    return
  }
  tls.autoplay = gsap.timeline({
    paused: pause,
    onUpdate: () => {
      emit(EVENT_PROGRESS, progress.value)
    }
  })
    .fromTo(progress, { value: 0 }, { value: 1, duration: delay, ease: 'linear' }, 0)
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

const set = (direction) => {
  index += direction
  index = loop(index, 0, total)
  emit(EVENT_CHANGE, index)
  play(direction)
}

// Swipe

// TODO test
const { direction } = useSwipe(el, {
  onSwipe (e) {
    console.info(direction)
  }
})
/*
const onSwipe = (direction) => {
  if (!swipeAble) { return }
  if (direction === 'left') {
    next()
  }
  if (direction === 'right') {
    prev()
  }
}
*/

// Expose
defineExpose({ prev, next })

</script>

<style scoped>
.AppSlider {
  position: relative;
  width: 100%;

  touch-action: pan-y;
}

.AppSlider.--inactive {
  pointer-events: none;
  touch-action: none;
}

.AppSlider-items {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  z-index: 1;
}

.AppSlider-item {
  position: absolute;
  flex: none;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;
}
</style>
