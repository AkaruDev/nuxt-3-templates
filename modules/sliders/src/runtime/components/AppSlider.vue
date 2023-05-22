<template>
  <div ref="el" class="AppSlider" :class="{ '--no-drag': !hasDrag }">
    <div ref="dragzone">
      <slot name="dragzone" />
    </div>
    <div ref="wrapper" class="AppSlider-items">
      <div
      class="AppSlider-item"
      ref="items"
      :key="`${name}-item-${i}`"
      v-for="(item, i) in props.items"
      >
        <slot name="item" :item="item" :i="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { clamp, lerp } from '../utils/math'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { useIntersectionObserver, useRafFn } from '@vueuse/core'

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
  isInfinite: {
    type: Boolean,
    default: true
  },
  hasDrag: {
    type: Boolean,
    default: true
  },
  hasSnap: {
    type: Boolean,
    default: false
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  speed: {
    type: Number,
    default: 0.5
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
})

// Define emits events
const EVENT_CHANGE = 'slider:change'
const EVENT_UPDATE = 'slider:update'
const EVENT_PRESS = 'slider:press'
const EVENT_RELEASE = 'slider:release'
const emit = defineEmits(['slider:change', 'slider:update', 'slider:press', 'slider:release'])

// Refs
const el = ref()
const touchDevice = ref(false)
const slots = useSlots()
const dragging = ref(false)
const isInit = ref(false)
const wrapper = ref('wrapper')
const items = ref('items')
const dragzone = ref('dragzone')

// Data
let animation = gsap.timeline()
let currentX = 0
let draggable = null
let ease = 0.08
let itemWidth = 0
let itemHeight = 0
let max = 0
let proxy = null
let slides = []
let scrollDelta = 0
let total = 0
let trigger = null
let viewWidth = 0
let wrap = null
let wrapWidth = 0
let progress = 0


// Watch
const index = ref(0);
watch(index, (newValue) => {
  emit(EVENT_CHANGE, { index: newValue })
})

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
  init()
  onResize()
})

onUnmounted(() => window.removeEventListener('resize', onResize))

const init = () => {
  proxy = document.createElement('div')
  trigger = slots.dragzone ? dragzone.value : wrapper.value

  setSlides()
  setAnimation()
  setDraggable()

  isInit.value = true
}

const setSlides = () => {
  if (props.items.length === 0) return
  total = props.items.length
  wrapWidth = 0
  itemHeight = 0

  viewWidth = wrapper.value.getBoundingClientRect().width
  itemWidth = items?.value?.[0]?.offsetWidth || 0
  wrapWidth = itemWidth * total

  // Loop items and create slides object
  slides = []
  items.value.forEach((item, i) => {

    item.setAttribute('data-index', i)

    const bounds = item.getBoundingClientRect()
    itemHeight = bounds.height > itemHeight ? bounds.height : itemHeight

    const progress = i / total
    const x = bounds.width * i
    const width = (itemHeight * bounds.width) / bounds.height
    const position = { x, width }
    const slide = {
      el: item,
      bounds,
      progress,
      position
    }

    slides.push(slide)
  })


  wrap = gsap.utils.wrap(0, wrapWidth)
  max = wrapWidth - viewWidth
}

const setAnimation = () => {
  animation.kill()
  animation = gsap.timeline({ paused: true })

  animation.to(items.value, {
    duration: 1,
    x: `+=${props.isInfinite ? wrapWidth : max}`,
    ease: 'none',
    modifiers: {
      x: (x, target) => {
        const i = parseInt(target.dataset.index)
        const xTo = props.isInfinite ? (parseInt(x) % wrapWidth) : x
        slides[i].progress = xTo / wrapWidth
        return `${xTo}px`
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

  if (props.isInfinite) {
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
  if (props.isInfinite) {
    progress = wrap(draggable[0].x) / wrapWidth
    animation.progress(progress)

    index.value = total - Math.ceil(progress * total)
  } else {
    x = draggable[0].x
    progress = clamp((draggable[0].x / -max), 0, 1)
    index.value = Math.round((total - 1) * progress)
  }

  emit(EVENT_UPDATE, {
    progress: 1.0 - progress,
    slidesProgress: slides.map(slide => { progress: slide.progress })
  })
}

const setX = ({ x }) => {
  currentX = x

  const d = draggable?.[0] || null
  if (!d) return
  gsap.set(d.target, { x })
  d.update()
  progress = wrap(d.x) / wrapWidth
  animation.progress(progress)

  index.value = total - Math.ceil(progress * total)
}

// Raf
useRafFn(() => onTick)
const onTick = () => {
  if (!isVisible.value || !isInit.value) return

  if (!props.isInfinite) {
    updateSlider()
  }

  if (props.autoplay && props.isInfinite && !dragging.value) {
    updateAutoscrollInfiniteSlider()
  }
}

const updateSlider = () => {
  const easeValue = dragging ? 0.2 : 0.08
  ease = lerp(ease, easeValue, 0.08)
  progressInertia = lerp(progressInertia, progress, ease)

  animation.progress(progressInertia)
}

const updateAutoscrollInfiniteSlider = () => {
  const scrollY = 0 // todo get real value
  scrollDelta = scrollY * 0.02

  gsap.set(draggable[0].target, {
    x: (draggable[0].x -= (props.speed + Math.abs(scrollDelta)) * props.direction)
  })
  draggable[0].update()
  progress = wrap(draggable[0].x) / wrapWidth
  animation.progress(progress)
}

// Nav
const next = ({ ease = 'power2.inOut', duration = 1 }) => {
  gsap.to(el, {
    x: currentX + itemWidth,
    duration,
    onUpdate: () => {
      setX({ x: currentX })
    },
    ease
  })
}

const prev = ({ ease = 'power2.inOut', duration = 1 }) => {
  gsap.to(el, {
    x: currentX - itemWidth,
    duration,
    onUpdate: () => {
      setX({ x: currentX })
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

  // TODO see if it's needed to setTimeout 0 this method
  setX({ x: currentX })
}

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
  height: 100%;
}

.AppSlider-item {
  position: relative;
  flex: none;
  height: 100%;

  top: 0;
  left: 0;
}
</style>
