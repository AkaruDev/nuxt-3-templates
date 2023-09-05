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
      <AppPlayerEmbed
        v-if="embed"
        :embed="embed"
      />
      <AppPlayerVimeo
        v-if="vimeo"
        ref="playerVimeo"
        :autoplay="autoplay"
        :url="vimeo"
        @play="onPlay"
        @pause="onPause"
      />
    </div>

    <!-- Controls -->
    <div
      v-if="controls"
      v-show="!cover"
      class="AppVideo-controls"
    >
      <AppVideoControls
        @change="onControlsChange"
      />
    </div>
  </div>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'

// Props
const props = defineProps({
  autoplay: {
    type: Boolean,
    default: false
  },
  controls: {
    type: Boolean,
    default: false
  },
  embed: {
    type: String,
    default: undefined
  },
  vimeo: {
    type: String,
    default: undefined
  },
})

// Data
const uid = `video-${useUID()}`


// Ref
const slots = useSlots()
const cover = ref(false)
cover.value = slots.cover !== undefined
const isInView = ref(false)
const playerVimeo = ref()

// Methods
const onIntersectionObserver = ([{ isIntersecting }]) => {
  isInView.value = isIntersecting

  if (isInView.value && slots.cover === undefined) {
    cover.value = false
  }

  if (!isInView.value && slots.cover !== undefined && props.embed !== undefined) {
    cover.value = true
  }
}

const onClickBtplay = () => {
  show()
}

const show = () => {
  cover.value = false
}

const onControlsChange = (state) => {
  vimeo?.value?.setState(state)
}

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
