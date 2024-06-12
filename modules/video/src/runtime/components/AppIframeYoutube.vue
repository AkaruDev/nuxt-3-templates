

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
        v-if="!props.youtubeCover"
        name="cover"
      />
      <img
        v-if="youtubeId && props.youtubeCover"
        loading="lazy"
        :src="`http://img.youtube.com/vi/${youtubeId}/0.jpg`"
      >
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
    />
  </div>
</template>

<script setup lang="ts">
import YouTubePlayer from 'youtube-player'
import { YouTubePlayer as YoutubePlayerType } from 'youtube-player/dist/types'
import { VideoState as VideoStateType } from '../types/videoState';

const emits = defineEmits(['onPause', 'onVideoEnd', 'onPlay'])

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

const state = ref<VideoStateType>({
  playing: false,
  loaded: false
})

// Data
let YtPlayer: YoutubePlayerType | null = null

// Computed
const youtubeId: ComputedRef<string | null> = computed(() => {
  if (!props?.url) return null
  const url = props.url
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length == 11) ? match[7] : null
})

// Methods
const initYoutubePlayer = () => {
  if (YtPlayer || !refPlayer.value) return
  YtPlayer = YouTubePlayer(refPlayer.value, {
    width: props.width,
    height: props.height,
    playerVars: {
      controls: 0,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      enablejsapi: 1,
    }
  })

  YtPlayer.on('stateChange', (event) => {
    switch (event.data) {
      case 2:
        onPause()
        break
      case 1:
        onPlay()
        break
      case 0:
        videoEnd()
        break
      default:
        break
    }
  })
}
const onClickPlay = () => {
  initYoutubePlayer()

  if (!YtPlayer) return
  if (youtubeId.value) YtPlayer.loadVideoById(youtubeId.value)

  state.value.loaded = true
  state.value.playing = true
}

const play = () => {
  state.value.playing = true
  YtPlayer?.playVideo()
}

const pause = () => {
  state.value.playing = false
  YtPlayer?.pauseVideo()
}

const onPause = () => {
  emits('onPause')
}

const videoEnd = () => {
  emits('onVideoEnd')
}

const onPlay = () => {
  emits('onPlay')
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
