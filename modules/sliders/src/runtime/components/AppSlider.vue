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

import { useIntersectionObserver } from "@vueuse/core"

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
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
  sortOffsetBy1: {
    type: Boolean,
    default: true
  },
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
const dragzone = ref()
const index = ref(0);
const isInit = ref(false)
const slideItems = ref('items')
const slots = useSlots()
const touchDevice = ref(false)
const wrapper = ref()

// Data
const directions = {
  previous: 1,
  next: -1
}
let animation = gsap.timeline()
let currentX = 0
let currentY = 0
let draggable = null
let ease = 0.1
let itemWidth = 0
let itemHeight = 0
let max = 0
let progress = 0
let progressInertia = 0
let proxy = null
let slides = []
let total = 0
let trigger = null
let viewWidth = 0
let viewHeight = 0
let wrap = null
let wrapWidth = 0
let wrapHeight = 0

const orientations = {
  horizontal: 'horizontal',
  vertical: 'vertical',
}
const isHorizontal = computed(() => {
  return props.orientation === orientations.horizontal
})


// Intersection Observer
const isVisible = ref(false)
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
}
const onLeave = () => {
  isVisible.value = false
}

//
onMounted(() => {
  window.addEventListener('resize', onResize)
  gsap.ticker.add(onTick)
})

onUnmounted(() => {
  isInit.value = false
  gsap.ticker.remove(onTick)
  window.removeEventListener('resize', onResize)
})

const init = () => {
  if (isInit.value) return
  proxy = document.createElement('div')
  trigger = slots.dragzone ? dragzone.value : wrapper.value

  setSlides()
  setAnimation()
  setDraggable()

  isInit.value = true
  emit(EVENT_READY, slides)
  updateProgress()
}

const setSlides = () => {
  if (props.items.length === 0) return

  // Reorder
  const itemsSorted = [...slideItems.value]
  if (props.sortOffsetBy1) {
    const last = itemsSorted.pop()
    itemsSorted.unshift(last)
  }

  total = itemsSorted.length

  // Set widths, heights
  const wrapperBounds = wrapper.value.getBoundingClientRect()
  viewWidth = wrapperBounds.width
  viewHeight = wrapperBounds.height
  itemWidth = itemsSorted?.[0]?.offsetWidth || 0
  itemHeight = itemsSorted?.[0]?.offsetHeight || 0
  wrapWidth = itemWidth * total
  wrapHeight = itemHeight * total

  // Loop items and create slides object
  slides = []
  itemsSorted.forEach((item, i) => {

    item.setAttribute('data-index', i)

    const bounds = item.getBoundingClientRect()
    if (isHorizontal.value) {
      itemHeight = bounds.height > itemHeight ? bounds.height : itemHeight
    } else {
      itemWidth = bounds.width > itemWidth ? bounds.width : itemWidth
    }

    const slideProgress = (i + 1) / total
    const x = bounds.width * (i + 1)
    const y = bounds.height * (i + 1)
    const position = { x, y }
    const slide = {
      el: item,
      bounds,
      slideProgress,
      position
    }

    if (isHorizontal.value) {
      gsap.set(item, { position: 'absolute', x: slide.position.x, })
    } else {
      gsap.set(item, { position: 'absolute', y: slide.position.y, })
    }

    slides.push(slide)
  })

  if (isHorizontal.value) {
    gsap.set(el.value, { height: itemHeight })
  } else {
    gsap.set(el.value, { width: itemWidth })
  }

  if (isHorizontal.value) {
    gsap.set(wrapper.value, { x: -itemWidth * props.offsetFactor })
  } else {
    gsap.set(wrapper.value, { y: -itemHeight * props.offsetFactor })
  }

  if (isHorizontal.value) {
    wrap = gsap.utils.wrap(0, wrapWidth)
    max = wrapWidth - viewWidth
  } else {
    wrap = gsap.utils.wrap(0, wrapHeight)
    max = wrapHeight - viewHeight
  }
}

const modifyPosition = (value, target, wrapBounds) => {
  const i = parseInt(target.dataset.index)
  const modulo = parseInt(value) % wrapBounds
  const to = props.infinite ? (`${modulo}px`) : value
  slides[i].progress = modulo / wrapBounds
  return to
}

const setAnimation = () => {
  animation.kill()
  animation = gsap.timeline({ paused: true })

  const value = isHorizontal.value ?
    {
      x: `+=${props.infinite ? wrapWidth : -max}`,
      modifiers: {
        x: (x, target) => {
          return modifyPosition(x, target, wrapWidth)
        }
      }
    } : {
      y: `+=${props.infinite ? wrapHeight : -max}`,
      modifiers: {
        y: (y, target) => {
          return modifyPosition(y, target, wrapHeight)
        }
      }
    }

  animation.to(slideItems.value, {
    ...value,
    duration: 1,
    ease: 'none',
  })
}

// Draggable
const setDraggable = () => {
  const options = getDraggableOptions()
  draggable?.[0]?.kill()
  draggable = Draggable.create(proxy, options)
}

const getDraggableOptions = () => {
  let options = {
    type: isHorizontal.value ? 'x' : 'y',
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
      bounds: isHorizontal.value ? { minX: 0, maxX: -max } : { minY: 0, maxY: -max },
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
    if (isHorizontal.value) {
      options.snap = {
        x: x => {
          return Math.round(x / itemWidth) * itemWidth
        }
      }
    } else {
      options.snap = {
        y: y => {
          return Math.round(y / itemHeight) * itemHeight
        }
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

  const value = isHorizontal.value ? draggable[0].x : draggable[0].y
  const wrapBounds = isHorizontal.value ? wrapWidth : wrapHeight
  if (props.infinite) {
    currentX = value
    currentY = value
    progress = ((wrap?.(value) / wrapBounds) || 0).toPrecision(8)

    animation.progress(progress)

    const betweenLastAndFirst = (1 / total) * 0.5
    index.value = progress < betweenLastAndFirst ? 0 : total - Math.round(progress * total)
  } else {
    currentX = value
    currentY = value
    progress = clamp((value / -max), 0, 1)
    index.value = Math.round((total - 1) * progress)
  }

  emit(EVENT_CHANGE, {
    index: gsap.utils.clamp(0, slides.length - 1, index?.value || 0),
    progress: 1.0 - progress,
    slides: slides.map(slide => { return { el: slide.el, progress: slide.progress } })
  })
}

const setPosition = ({ x, y }) => {
  currentX = x
  currentY = y

  const currentDrag = draggable?.[0] || null
  if (!currentDrag) return
  const value = isHorizontal.value ? currentDrag.x : currentDrag.y
  const wrapBounds = isHorizontal.value ? wrapWidth : wrapHeight
  gsap.set(currentDrag.target, { x, y })
  currentDrag.update()
  progress = ((wrap?.(value) / wrapBounds) || 0).toPrecision(8)
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
  const fixJiggle = 0.001 // Fix for weird trembling movement
  if (isHorizontal.value) {
    const x = (draggable[0].x - (props.speed * props.direction)) + fixJiggle // Fix for weird trembling movement
    gsap.set(draggable[0].target, { x })
  } else {
    const y = (draggable[0].y - (props.speed * props.direction)) + fixJiggle // Fix for weird trembling movement
    gsap.set(draggable[0].target, { y })
  }

  draggable[0].update()

  updateProgress()
}



// Nav
const getCurrentIndex = () => {
  return isHorizontal.value ? Math.round(currentX / itemWidth) : Math.round(currentY / itemHeight)
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
  const target = { currentX, currentY }
  const diff = index - getCurrentIndex()
  const indexDiffDirection = diff === 0 ? 1 : -1

  if (!props.infinite && index === 0 && direction === directions.previous) return
  if (!props.infinite && index <= ((total - 2 - props.offsetFactor) * directions.next) && direction === directions.next) return


  const x = (index * itemWidth * indexDiffDirection) + (itemWidth * direction)
  const y = (index * itemHeight * indexDiffDirection) + (itemHeight * direction)
  gsap.to(target, {
    currentX: x,
    currentY: y,
    duration,
    onUpdate: () => {
      setPosition({ x: target.currentX, y: target.currentY })
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

  goTo(getCurrentIndex(), 0, 0)
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
