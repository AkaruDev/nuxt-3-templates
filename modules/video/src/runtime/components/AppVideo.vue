<template>
  <div
    v-intersection-observer="onIntersectionObserver"
    class="AppVideo"
  >
    <!-- Cover -->
    <div
      v-show="cover"
      class="AppVideo-cover"
    >
      <slot
        name="cover"
      />
      <div
        class="AppVideo-btplay"
        @click="onClickBtplay"
      >
        <slot
          name="btplay"
        />
      </div>
    </div>
    <!-- Player -->
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

const uid = `video-${useUID()}`

const props = defineProps({
  autoplay: {
    type: Boolean,
    default: false
  }
})

// Composables
const { events, bus, on, off } = useVideoBus()

// Ref
const slots = useSlots()
const cover = ref(false)
cover.value = slots.cover !== undefined
const isInView = ref(false)

// Methods
const onShow = (id) => {
  if (id === uid) {
    cover.value = false
  }
}
on(events.show, onShow)

const onIntersectionObserver = ([{ isIntersecting }]) => {
  isInView.value = isIntersecting

  if (isInView.value && (slots.cover === undefined || props.autoplay)) {
    cover.value = false
  }

  if (!isInView.value && slots.cover !== undefined && !props.autoplay) {
    cover.value = true
  }
}

const onClickBtplay = () => {
  bus.emit(events.show, uid)
}

// Lifecycle
onUnmounted(() => {
  off(events.show, onShow)
})

// Expose
defineExpose({ uid })
</script>

<style  scoped>
.AppVideo {
  position: relative;

}

.AppVideo-cover {
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  overflow: hidden;

  z-index: 1;
}

.AppVideo-btplay {
  position: relative;

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
