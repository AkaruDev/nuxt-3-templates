<template>
  <div
    v-intersection-observer="onIntersectionObserver"
    class="AppVideo"
    :class="{ '--fullscreen': state.fullscreen }"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
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
      <!-- Player embed -->
      <AppPlayerEmbed
        v-if="type === TYPES.EMBED"
        :embed="src"
      />
      <!-- Player vimeo -->
      <AppPlayerVimeo
        v-if="type === TYPES.VIMEO"
        ref="player"
        :url="src"
        :autoplay="autoplay"
        :muted="muted"
        @play="onPlay"
        @pause="onPause"
      />
      <!-- Player file -->
      <AppPlayerFile
        v-if="type === TYPES.FILE"
        ref="player"
        :url="src"
        :extensions="extensions"
        :autoplay="autoplay"
        :muted="muted"
        @play="onPlay"
        @pause="onPause"
      />
    </div>

    <!-- Controls -->
    <AppVideoControls
      v-if="controls"
      v-show="!cover"
      :state="state"
      :style="{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none' }"
      :progress="player?.progress || 0"
      :duration="player?.duration"
      @change="onControlsChange"
    />
  </div>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'

// Props
const TYPES = {
  VIMEO: 'vimeo',
  EMBED: 'embed',
  FILE: 'file',
}
const props = defineProps({
  autoplay: {
    type: Boolean,
    default: true
  },
  loop: {
    type: Boolean,
    default: true
  },
  controls: {
    type: Boolean,
    default: false
  },
  src: {
    type: String,
    required: true
  },
  extensions: {
    type: [String, Array],
    default: () => ["webm", "mp4"],
  },
  type: {
    type: String,
    default: undefined,
    validator (value) {
      return ['vimeo', 'embed', 'file'].includes(value)
    }
  },
  muted: {
    type: Boolean,
    default: true
  },
})

// Data
const uid = `video-${useUID()}`

// Ref
const slots = useSlots()
const cover = ref(slots.cover !== undefined)
const isInView = ref(false)
const showControls = ref(false)
const player = ref()
const state = ref({
  muted: props.muted,
  playing: props.autoplay,
  fullscreen: false,
})
let timeoutId = null

// Methods
const onIntersectionObserver = ([{ isIntersecting }]) => {
  isInView.value = isIntersecting

  if (isInView.value && slots.cover === undefined) {
    cover.value = false
  }

  // If embed && cover && not in view then hide
  if (!isInView.value && slots.cover !== undefined && props.type === TYPES.EMBED) {
    cover.value = true
  }

  if (isInView.value && props.autoplay && !props.controls) {
    cover.value = false
    play()
  }
  if (!isInView.value) {
    pause()
  }
}

const play = () => {
  player?.value?.play()
}

const pause = () => {
  player?.value?.pause()
}

const togglePlayPause = () => {
  if (!player.value) return
  state.value.playing = !state.value.playing
  if (state.value.playing) play()
  else pause()
}

const toggleMute = () => {
  state.value.muted = !state.value.muted

  const volume = state.value.muted ? 0 : 1
  player?.value?.setVolume(volume)
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document?.documentElement?.requestFullscreen?.().then(() => {
      state.value.fullscreen = true
    });
  } else {
    document?.exitFullscreen?.().then(() => {
      state.value.fullscreen = false
    });
  }
}

const setProgress = (progress) => {
  state.value.progress = progress

  player?.value?.setProgress?.(progress)
}

const show = () => {
  cover.value = false
}

// Events
const onClickBtplay = () => {
  show()
}

const onPlay = () => {
  state.value.playing = true
}

const onPause = () => {
  state.value.playing = false
}

const onMouseEnter = () => {
  showControls.value = true
  hideControlsLater()
}

const onMouseMove = () => {
  showControls.value = true
  hideControlsLater()
}
const onMouseLeave = () => {
  showControls.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

const hideControlsLater = () => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    showControls.value = false
  }, 3000)
}

const onControlsChange = (control) => {
  if (control?.togglePlayPause) {
    togglePlayPause()
  }
  if (control?.toggleMute) {
    toggleMute()
  }
  if (control?.toggleFullscreen) {
    toggleFullscreen()
  }
  if (control?.progress) {
    setProgress(control.progress)
  }
}

// Lifecycle
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
})

// Expose
defineExpose({ uid, play, pause })
</script>

<style  scoped>
.AppVideo {
  position: relative;
}

.AppVideo.--fullscreen {
  position: fixed !important;
  width: 100vw !important;
  height: 100vh !important;

  top: 0 !important;
  left: 0 !important;

  margin: 0 !important;

  z-index: 999;
}

.AppVideo .AppVideoControls {
  z-index: 10;

  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
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

  &:deep(.AppPlayerVimeo) {
    pointer-events: none;
  }
}
</style>
