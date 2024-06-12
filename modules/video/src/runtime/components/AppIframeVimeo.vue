

<template>
  <div
    class="AppVideo"
    :style="{ 'aspect-ratio': `${props.width} / ${props.height}` }"
  >
    <!-- Cover -->
    <div
      v-if="!state.loaded"
      class="AppVideo-cover"
    >
      <slot
        name="cover"
      />
    </div>

    <!-- Bt Play -->
    <AppVideoPlayButton
      v-if="!state.loaded"
      class="AppVideo-btplay"
      @click="onClickPlay"
    />

    <!-- Player -->
    <div
      ref="refPlayer"
      class="AppVideo-player"
      :data-vimeo-url="props.url"
      data-vimeo-defer
    />
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['onPause', 'onPlay'])

const props = defineProps({
  url: {
    required: false,
    default: '',
    type: String
  },
  youtubeCover: {
    required: false,
    default: false,
    type: Boolean
  },
  width: {
    required: false,
    type: Number,
    default: 1920
  },
  height: {
    required: false,
    type: Number,
    default: 1080
  },
})

// Ref
const refPlayer = ref<HTMLElement | null>(null)

// Data
let Vimeo: any = null;
let player: any = null;

const state = ref({
  playing: false,
  loaded: false
})

const options = {
  allowfullscreen: true,
  background: false,
  dnt: true,
  keyboard: false,
  portrait: false,
  byline: false,
  loop: false,
  autoplay: false
}

// Lifecycle
onMounted(async () => {
  if (navigator.userAgent.includes('Chrome-Lighthouse')) { return }

  Vimeo = (await import('@vimeo/player')).default
})

// Methods
const initVimeoPlayer = () => {
  if (player !== null) return
  player = new Vimeo(refPlayer.value, { ...options, url: props.url })
}

const onClickPlay = () => {
  initVimeoPlayer()
  load(props.url)

  state.value.loaded = true
}

const load = (url: string) => {
  player
    .loadVideo(url)
    .then(async () => {
      play()
    })
}


const play = () => {
  state.value.playing = true
  player?.play()
    .then(() => {
      emits('onPlay')
    })
}

const pause = () => {
  state.value.playing = false
  player?.pause()
    .then(() => {
      emits('onPause')
    })
}


defineExpose({ play, pause })
</script>

<style scoped>
.AppVideo {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.AppVideo-player {
  width: 100%;
  height: 100%;
}

.AppVideo:deep(iframe) {
  width: 100%;
  height: 100%;
}

.AppVideo-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.AppVideo-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
