<template>
  <video
    ref="player"
    class="AppPlayerFile"
    :preload="preload"
    :loop="loop"
    :muted="muted"
  >
    <source
      v-for="(extension, i) in extensions"
      :key="`video-${i}-${extension}`"
      :src="`${url}.${extension}`"
      :type="`video/${extension}`"
    >
  </video>
</template>

<script setup>
// Props
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  extensions: {
    type: [String, Array],
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  loop: {
    type: Boolean,
    default: true
  },
  muted: {
    type: Boolean,
    default: true
  }
})

// Refs
/**
 * @type {{value:HTMLVideoElement}} player
 */
const player = ref()
const preload = ref("none")
const progress = ref(0)
const duration = ref(0)

// Lifecycle
onMounted(async () => {
  player.value.addEventListener('canplaythrough', onCanPlayThrough)
  player.value.addEventListener('loadedmetadata', onCanPlayThrough)
  player.value.addEventListener('timeupdate', onTimeUpdate)

  if (props.autoplay) play()
})

onUnmounted(() => {
  player?.value?.removeEventListener('canplaythrough', onCanPlayThrough)
  player?.value?.removeEventListener('loadedmetadata', onCanPlayThrough)
  player?.value?.removeEventListener('timeupdate', onTimeUpdate)
})

// Events
const events = {
  play: 'play',
  pause: 'pause',
  progress: 'progress',
}
const emit = defineEmits(['play', 'pause', 'progress'])

// Methods
const onTimeUpdate = () => {
  progress.value = player?.value?.currentTime / duration.value
}

const onCanPlayThrough = () => {
  console.info("onCanPlayTrough")
  duration.value = player?.value?.duration || 0
  if (props.autoplay) play()
}

const play = () => {
  if (preload.value === "none") {
    preload.value = "auto"
    player?.value?.load()
  } else {
    player?.value?.play()
      .then(() => {
        emit(events.play)
      })
  }

}
const pause = () => {
  player?.value?.pause()
  emit(events.pause)
}

const setVolume = (volume) => {
  if (!player.value) return
  player.value.volume = volume
}

const setProgress = (progress) => {
  if (!player.value) return
  player.value.currentTime = progress * duration.value
}

// Expose
defineExpose({ play, pause, setVolume, progress, setProgress, duration })
</script>

<style scoped>
.AppPlayerFile {
  width: 100%;
  height: 100%;

  object-fit: cover;
}
</style>
