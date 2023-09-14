<template>
  <div
    ref="el"
    class="AppSlider"
    :class="{ '--no-drag': !hasDrag }"
  >
    <div ref="dragzone">
      <slot name="dragzone" />
    </div>
    <div
      ref="wrapper"
      class="AppSlider-items"
    >
      <div
        v-for="(item, i) in props.items"
        ref="slideItems"
        :key="`${name}-item-${i}`"
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
import { clamp, lerp } from '../utils/math'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

import { useIntersectionObserver } from '@vueuse/core'

// GSAP
gsap.registerPlugin(Draggable)

// Props
const props = defineProps({
  name: {
    type: String,
    default: 'slider'
  },
  items: {
    type: Array,
    default: () => []
  },
  infinite: {
    type: Boolean,
    default: true
  },
  hasDrag: {
    type: Boolean,
    default: true
  },
  hasSnap: {
    type: Boolean,
    default: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  speed: {
    type: Number,
    default: 1
  },
  direction: {
    type: Number,
    default: 1,
    validator: (value) => [-1, 1].includes(value)
  },
  draggableOptions: {
    type: Object,
    required: false,
    default: () => { }
  },
  offsetFactor: {
    type: Number,
    default: 2
  }
})

// Define emits events
const EVENT_CHANGE = 'change'
const EVENT_PRESS = 'press'
const EVENT_READY = 'ready'
const EVENT_RELEASE = 'release'
const emit = defineEmits(['ready', 'change', 'press', 'release'])

// Refs
const el = ref()
const dragging = ref(false)
const dragzone = ref('dragzone')
const index = ref(0);
const isInit = ref(false)
const slideItems = ref('items')
const slots = useSlots()
const touchDevice = ref(false)
const wrapper = ref('wrapper')

// Data
const directions = {
  previous: 1,
  next: -1
}
let animation = gsap.timeline()
let currentX = 0
let draggable = null
let ease = 0.1
let itemWidth = 0
let itemHeight = 0
let max = 0
let progress = 0
let proxy = null
let slides = []
let total = 0
let trigger = null
let viewWidth = 0
let wrap = null
let wrapWidth = 0


// Intersection Observer
const isVisible = ref(true)
useIntersectionObserver(
  el,
  ([{ isIntersecting }]) => {
    isVisible.value = isIntersecting
  },
)

//
onMounted(() => {
  window.addEventListener('resize', onResize)
  gsap.ticker.add(onTick)
  init()
  onResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  gsap.ticker.remove(onTick)
})

const init = () => {
  proxy = document.createElement('div')
  trigger = slots.dragzone ? dragzone.value : wrapper.value

  setSlides()
  setAnimation()
  setDraggable()

  isInit.value = true
  emit(EVENT_READY, slides)
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

  viewWidth = wrapper.value.getBoundingClientRect().width
  itemWidth = itemsSorted?.[0]?.offsetWidth || 0
  wrapWidth = itemWidth * total

  // Loop items and create slides object
  slides = []
  itemsSorted.forEach((item, i) => {

    item.setAttribute('data-index', i)

    const bounds = item.getBoundingClientRect()
    itemHeight = bounds.height > itemHeight ? bounds.height : itemHeight

    const progress = (i + 1) / total
    const x = bounds.width * (i + 1)
    const width = (itemHeight * bounds.width) / bounds.height
    const position = { x, width }
    const slide = {
      el: item,
      bounds,
      progress,
      position
    }

    gsap.set(item, { position: 'absolute', x: slide.position.x, })

    slides.push(slide)
  })

  gsap.set(el.value, { height: itemHeight })

  if (props.infinite) {
    gsap.set(wrapper.value, {
      x: -itemWidth * props.offsetFactor
    })
  }

  wrap = gsap.utils.wrap(0, wrapWidth)
  max = wrapWidth - viewWidth
}

const setAnimation = () => {
  animation.kill()
  animation = gsap.timeline({ paused: true })

  animation.to(slideItems.value, {
    duration: 1,
    x: `+=${props.infinite ? wrapWidth : max}`,
    ease: 'none',
    modifiers: {
      x: (x, target) => {
        const i = parseInt(target.dataset.index)
        const modulo = parseInt(x) % wrapWidth
        const xTo = props.infinite ? (`${modulo}px`) : x
        slides[i].progress = modulo / wrapWidth
        return xTo
      }
    }
  })
}

// Draggable
const setDraggable = () => {
  const options = getDraggableOptions()
  draggable = Draggable.create(proxy, options)
}

const getDraggableOptions = () => {
  let options = {
    type: 'x',
    trigger,
    edgeResistance: 0.0,
    dragResistance: 0.0,
    onDrag: () => updateProgress(),
    onPress: () => onPress(),
    onRelease: () => onRelease(),
    onThrowUpdate: () => updateProgress()
  }

  if (props.infinite) {
    options = {
      ...options,
      edgeResistance: touchDevice.value ? 1.70 : 0.85,
      dragResistance: touchDevice.value ? 0.12 : 0.3,
      inertia: true,
      ...props.draggableOptions,
    }
  } else {
    options = {
      ...options,
      throwProps: true,
      edgeResistance: 0.0,
      dragResistance: 0.0,
      bounds: { minX: 0, maxX: -max },
      throwResistance: 0.5,
      maxDuration: 0.5,
      overshootTolerance: 0,
      cursor: 'grab',
      activeCursor: 'grabbing',
      allowContextMenu: true,
      ...props.draggableOptions,
    }
  }

  if (props.hasSnap) {
    options.snap = {
      x: x => {
        return Math.round(x / itemWidth) * itemWidth
      }
    }
  }

  return options
}
const onPress = () => {
  dragging.value = true
  emit(EVENT_PRESS)
}

const onRelease = () => {
  dragging.value = false
  emit(EVENT_RELEASE)
}

// Progress
const updateProgress = () => {
  if (!draggable?.[0]) return
  if (props.infinite) {
    progress = wrap(draggable[0].x) / wrapWidth
    animation.progress(progress)

    index.value = progress === 0 ? 0 : total - Math.round(progress * total)
  } else {
    x = draggable[0].x
    progress = clamp((draggable[0].x / -max), 0, 1)
    index.value = Math.round((total - 1) * progress)
  }

  emit(EVENT_CHANGE, {
    index: index.value,
    progress: 1.0 - progress,
    slides: slides.map(slide => { return { el: slide.el, progress: slide.progress } })
  })
}

const setX = ({ x }) => {
  currentX = x

  const currentDrag = draggable?.[0] || null
  if (!currentDrag) return
  gsap.set(currentDrag.target, { x })
  currentDrag.update()
  progress = wrap(currentDrag.x) / wrapWidth
  animation.progress(progress)

  index.value = (total - 1) - Math.ceil(progress * total)
}

// Raf
const onTick = () => {
  if (!isVisible.value || !isInit.value) return

  if (!props.infinite) {
    updateSlider()
  }

  if (props.autoplay && props.infinite && !dragging.value) {
    updateAutoplay()
  }
}

const updateSlider = () => {
  const easeValue = dragging ? 0.2 : 0.08
  ease = lerp(ease, easeValue, 0.08)
  progressInertia = lerp(progressInertia, progress, ease)

  animation.progress(progressInertia)
}

const updateAutoplay = () => {
  gsap.set(draggable[0].target, {
    x: draggable[0].x -= props.speed * props.direction
  })
  draggable[0].update()
  progress = wrap(draggable[0].x) / wrapWidth

  animation.progress(progress)
  updateProgress()
}



// Nav
const getCurrentIndex = () => {
  return Math.round(currentX / itemWidth)
}

/**
 *
 * @param {Number} duration
 * @param {String} ease from gsap
 */
const next = (duration = 1, ease = 'power3.out') => {
  const index = getCurrentIndex()
  goTo(index, directions.next, duration, ease)
}

/**
 *
 * @param {Number} duration
 * @param {String} ease from gsap
 */
const prev = (duration = 1, ease = 'power3.out') => {
  const index = getCurrentIndex()
  goTo(index, directions.previous, duration, ease)
}

/**
 *
 * @param {Integer} index
 * @param {Integer} direction
 * @param {Number} duration
 * @param {String} ease from gsap
 */
const goTo = (index, direction = 0, duration = 1, ease = 'power3.out') => {
  const target = { currentX }
  const diff = index - getCurrentIndex()
  const indexDiffDirection = diff === 0 ? 1 : -1
  const x = (index * itemWidth * indexDiffDirection) + (itemWidth * direction)
  gsap.to(target, {
    currentX: x,
    duration,
    onUpdate: () => {
      setX({ x: target.currentX })
      updateProgress()
    },
    ease
  })
}

// Resize
const setTouchDevice = () => {
  touchDevice.value = window.matchMedia?.('(hover: none) and (pointer: coarse)')?.matches || false
}
const onResize = () => {
  setTouchDevice()
  setSlides()
  setAnimation()

  setX({ x: currentX })
  updateProgress()
}

// Expose
defineExpose({ prev, next, goTo })

</script>

<style scoped>
.AppSlider {
  position: relative;
}

.AppSlider.--no-drag {
  pointer-events: none;
  overflow: hidden;
}

.AppSlider-items {
  display: flex;
  width: 100%;
}
</style>
