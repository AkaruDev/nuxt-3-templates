<template>
  <div
    v-if="url"
    ref="el"
    class="AppPlayerVimeo"
    :data-vimeo-url="url"
    data-vimeo-defer
  />
</template>

<script setup>
import { fit } from '../utils/math'

// Props
const props = defineProps({
  url: {
    type: String,
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


// Events
const events = {
  play: 'play',
  pause: 'pause',
  progress: 'progress',
}
const emit = defineEmits(['play', 'pause', 'progress'])

// Data
const options = {
  allowfullscreen: true,
  background: true,
  dnt: true,
  keyboard: false,
  portrait: false,
  byline: false,
  loop: props.loop,
  autoplay: props.autoplay
}

const el = ref()
const ready = ref(false)
const progress = ref(0)
const duration = ref(0)

let Vimeo = null
let player = null
let iframe = null

// Lifecycle
onMounted(async () => {
  if (navigator.userAgent.includes('Chrome-Lighthouse')) { return }

  Vimeo = (await import('@vimeo/player')).default
  ready.value = true

  load(props.url)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)

  player?.off?.('timeupdate', onTimeUpdate)
})

// Methods

/**
 * Load video by url
 * @param {String} url Vimeo url
 */
const load = (url) => {
  if (!ready.value) return
  if (!player) {
    player = new Vimeo(el.value, { ...options, url })

    player.on('timeupdate', onTimeUpdate)
  }

  player
    .loadVideo(url)
    .then(async () => {
      if (!iframe) iframe = el.value.querySelector('iframe')
      window.addEventListener('resize', onResize)
      onResize()

      duration.value = await player.getDuration()
      setVolume(props.muted ? 0 : 1)

      play()

    })
}


const onResize = () => {
  resize()
}

const resize = () => {
  if (!iframe) return

  const from = iframe.getBoundingClientRect()
  const to = el.value.getBoundingClientRect()

  const { width, height, x, y } = fit(from, to)

  iframe.style.width = `${width}px`
  iframe.style.height = `${height}px`
  iframe.style.left = `${x}px`
  iframe.style.top = `${y}px`
}

const onTimeUpdate = ({ percent }) => {
  progress.value = percent
}

const play = () => {
  player?.play()
    .then(() => {
      emit(events.play)
    })
}
const pause = () => {
  player?.pause()
    .then(() => {
      emit(events.pause)
    })
}

const setVolume = (volume) => {
  player?.setVolume(volume)
}

const setProgress = (percent) => {
  player?.setCurrentTime(percent * duration.value)
}

// Expose
defineExpose({ play, pause, setVolume, progress, setProgress, duration })

</script>

<style scoped>
.AppPlayerVimeo {
  position: relative;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  overflow: hidden;

  z-index: 0;
}

.AppPlayerVimeo:deep(iframe) {
  position: absolute;

  top: 0;
  left: 0;

  z-index: 0;

}
</style>
