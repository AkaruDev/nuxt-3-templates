<template>
  <div
    v-intersection-observer="onIntersectionObserver"
    class="AppVideo"

    :class="{ '--fullscreen': state.fullscreen }"
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
        v-if="embed"
        :embed="embed"
      />
      <!-- Player vimeo -->
      <AppPlayerVimeo
        v-if="vimeo"
        ref="player"
        :autoplay="autoplay"
        :url="vimeo"
        @play="onPlay"
        @pause="onPause"
      />
      <!-- TODO videoplayer with source -->
    </div>

    <!-- Controls -->
    <AppVideoControls
      v-if="controls"
      v-show="!cover"
      :state="state.value"
      @change="onControlsChange"
    />
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
  mute: {
    type: Boolean,
    default: true
  },
})

// TODO props loop
// TODO props video type file, embed, vimeo

// Data
const uid = `video-${useUID()}`

// Ref
const slots = useSlots()
const cover = ref(false)
cover.value = slots.cover !== undefined
const isInView = ref(false)
const player = ref()
const state = ref({
  mute: props.mute,
  playing: false,
  fullscreen: false,
})

// Methods
const onIntersectionObserver = ([{ isIntersecting }]) => {
  isInView.value = isIntersecting

  if (isInView.value && slots.cover === undefined) {
    cover.value = false
  }

  // If embed && cover && not in view then hide
  // TODO if type embed
  if (!isInView.value && slots.cover !== undefined && props.embed !== undefined) {
    cover.value = true
  }

  if (isInView.value && props.autoplay) {
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
  state.value.mute = !state.value.mute

  const volume = state.value.mute ? 0 : 1
  player?.value?.setVolume(volume)
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document?.documentElement?.requestFullscreen?.().then(() => {
      state.value.fullscreen = true
      player?.value?.resize(true)
    });
  } else {
    document?.exitFullscreen?.().then(() => {
      state.value.fullscreen = false

      nextTick(() => {
        player?.value?.resize()
      })

    });
  }

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

const onControlsChange = (newState) => {
  if (newState.playing !== state.value.playing) {
    togglePlayPause()
  }
  if (newState.mute !== state.value.mute) {
    toggleMute()
  }
  if (newState.fullscreen !== state.value.fullscreen) {
    toggleFullscreen()
  }

  // TODO progress
}

// Expose
defineExpose({ uid })
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
