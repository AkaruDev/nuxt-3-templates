<template>
  <div
    v-show="show"
    ref="el"
    class="ScrollBar-component"
    :class="{
      '--is-scrolling': isScrolling,
      '--is-dragging': mouseDown
    }"
  >
    <div
      ref="thumb"
      class="ScrollBar-thumb"
      @mousedown="onScrollbarDragStart"
    />
  </div>
</template>

<script setup>
import { useSmoothScroll } from '../composables/smooth-scroll'

const el = ref(null)
const thumb = ref(null)
const mouseDown = ref(false)

const $smoothScroll = useSmoothScroll()

const isScrolling = computed(() => {
  if (!$smoothScroll) return false
  return Math.abs($smoothScroll.y.value - $smoothScroll.y.lerp) > 10
})

const show = computed(() => {
  return $smoothScroll?.active?.value && ($smoothScroll?.container?.value?.clientHeight || 0) > (el?.value?.getBoundingClientRect()?.height || 0)
})

onMounted(() => {
  $smoothScroll.on('scroll', onScroll)

  window.addEventListener('mouseup', onScrollBarRelease)
  window.addEventListener('mousemove', onScrollbarDrag)
})

onBeforeMount(() => {
  $smoothScroll.off('scroll', onScroll)
  window.removeEventListener('mouseup', onScrollBarRelease)
  window.removeEventListener('mousemove', onScrollbarDrag)
  document.body.style.cursor = ""
})


const onScroll = ({ target, value }) => {
  if (!el?.value) return
  const scrollY = mouseDown.value === true ? target : value
  const elHeight = el.value.clientHeight || 0
  const thumbHeight = thumb.value.clientHeight || 0
  const t = scrollY / $smoothScroll.bounds.value * (elHeight - thumbHeight - 4)
  thumb.value.style.transform = `translate3d(0px, ${t.toFixed(2)}px, 0px)`
}

const onScrollbarDragStart = () => {
  mouseDown.value = true
  document.body.style.cursor = "grabbing"
}

const onScrollBarRelease = () => {
  mouseDown.value = false
  document.body.style.cursor = ""
}

const onScrollbarDrag = (e) => {
  e.stopPropagation()
  if (!mouseDown.value) return

  const y = e.clientY / el.value.clientHeight * $smoothScroll.bounds.value
  $smoothScroll.goTo(y)
}

</script>

<style>
.ScrollBar-component {
  position: fixed;
  top: 0;
  right: 3px;
  width: 11px;
  height: 100vh;
  z-index: 1000;
  transform-origin: center right;
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.3s cubic-bezier(0.65, 0, 0.35, 1);
  opacity: 0.5;
}

.ScrollBar-component:hover,
.ScrollBar-component.--is-dragging,
.ScrollBar-component.--is-scrolling {
  opacity: 0.8;
  transform: scaleX(1.2);
}

.ScrollBar-component.--is-scrolling .ScrollBar-thumb,
.ScrollBar-component:hover .ScrollBar-thumb {
  opacity: 1;
}

.ScrollBar-component.--is-scrolling .ScrollBar-thumb,
.ScrollBar-component.--is-dragging .ScrollBar-thumb {
  cursor: grabbing;
  opacity: 1;
}

.ScrollBar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 80px;
  background-color: #9E9E9E;
  border-radius: 14px;
  opacity: 0.5;
  margin: 2px;
  cursor: grab;
  will-change: transform;
  transform: translate3d(0px, 0px, 0px);
  transition: opacity 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}
</style>
