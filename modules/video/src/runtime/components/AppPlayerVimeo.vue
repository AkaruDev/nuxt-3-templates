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

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  }
})

const options = {
  allowfullscreen: true,
  background: true,
  dnt: true,
  keyboard: false,
  portrait: false,
  byline: false,
  autoplay: props.autoplay
}

const events = {
  play: 'play',
  pause: 'pause',
  progress: 'progress',
}
const emit = defineEmits(['play', 'pause', 'progress'])

const el = ref()
const ready = ref(false)

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
  }

  player?.loadVideo(url)
    .then(() => {
      if (!iframe) iframe = el.value.querySelector('iframe')
      onResize()

      if (props.autoplay) {
        play()
      } else {
        pause()
      }


    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn(error)
    })
}


const onResize = () => {
  resize()

}

const resize = (fullscreen = false) => {
  if (!iframe) return

  iframe.style.width = ``
  iframe.style.height = ``
  iframe.style.left = `0px`
  iframe.style.top = `0px`

  if (!fullscreen) {
    const from = iframe.getBoundingClientRect()
    const to = el.value.getBoundingClientRect()
    console.info(to.width)

    const { width, height, x, y } = fit(from, to)

    iframe.style.width = `${width}px`
    iframe.style.height = `${height}px`
    iframe.style.left = `${x}px`
    iframe.style.top = `${y}px`
  } else {
    iframe.style.width = `100%`
    iframe.style.height = `100%`
    iframe.style.left = `0px`
    iframe.style.top = `0px`
  }

}


const play = () => {
  player?.play()
    .then(() => {
      emit(events.play)
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn(error)
    })
}
const pause = () => {
  player?.pause()
    .then(() => {
      emit(events.pause)
    }).catch((error) => {
      // eslint-disable-next-line no-console
      // console.warn(error)
    })
}


const setVolume = (volume) => {
  player?.setVolume(volume)
}

// Expose
defineExpose({ play, pause, setVolume, resize })

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
