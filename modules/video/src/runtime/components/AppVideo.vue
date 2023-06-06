<template>
  <div
    v-intersection-observer="onIntersectionObserver"
    class="AppVideo"
  >
    <div
      v-show="cover"
      class="AppVideo-cover"
    >
      <slot
        name="cover"
      />
      <button
        class="AppVideo-btplay"
        type="button"
        @click="onClickBtplay"
      />
    </div>
    <div
      v-if="!cover"
      class="AppVideo-player"
    >
      <slot
        name="player"
      />
    </div>
  </div>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'

// Composables
const { events, on, off } = useVideoBus()

// Ref
const slots = useSlots()
const cover = ref(false)
cover.value = slots.cover !== undefined
const isInView = ref(false)

// Methods
const onShow = () => {
  cover.value = false
}
on(events.show, onShow)

const onIntersectionObserver = ([{ isIntersecting }]) => {
  isInView.value = isIntersecting

  if (isInView.value && slots.cover === undefined) {
    cover.value = false
  }

  if (!isInView.value && slots.cover !== undefined) {
    cover.value = true
  }
}

const onClickBtplay = () => {
  cover.value = false
}

// Lifecycle
onUnmounted(() => {
  off(events.show, onShow)
})
</script>

<style  scoped>
.AppVideo {
  position: relative;

}

.AppVideo-cover {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  overflow: hidden;

  z-index: 1;
}

.AppVideo-btplay {
  position: absolute;
  width: 0;
  height: 0;

  top: 50%;
  left: 50%;

  margin-left: -25px;
  margin-top: -25px;

  background-color: transparent;
  border-style: solid;
  border-width: 25px 0 25px 50px;
  border-color: transparent transparent transparent white;

  cursor: pointer;

  z-index: 1;
}

.AppVideo-player {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  z-index: 0;
}
</style>
