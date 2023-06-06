<template>
  <div
    v-if="url"
    ref="el"
    v-intersection-observer="onIntersectionObserver"
    class="AppPlayerVimeo"
    :data-vimeo-url="url"
    data-vimeo-defer
  />
</template>

<script setup>

import { vIntersectionObserver } from '@vueuse/components'
import { fit } from '../utils/math'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: true
  }
})

const options = {
  background: true,
  dnt: true,
  keyboard: false,
  portrait: false,
  byline: false,
  autoplay: false
}

const events = {
  play: 'play',
  pause: 'pause'
}
const emit = defineEmits(['play'])

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
const isInView = ref(false)
const onIntersectionObserver = ([{ isIntersecting }]) => {
  isInView.value = isIntersecting

  if (isInView.value && props.autoplay) {
    play()
  }
  if (!isInView.value) {
    pause()
  }
}

/**
 * Load url vide
 * @param {String} url Vimeo url
 */
const load = (url) => {
  if (!ready.value) return
  if (!player) {
    player = new Vimeo(el.value, { ...options, url })
  }

  player?.loadVideo(url).then(() => {
    if (!iframe) iframe = el.value.querySelector('iframe')
    onResize()

    if (props.autoplay) {
      player.play().then(() => {
        emit(events.play)
      })
    }

  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.warn(error)
  })
}

const play = () => {
  player?.play().then(() => {
    emit(events.play)
  })
}
const pause = () => {
  player?.pause().then(() => {
    emit(events.pause)
  })
}

// TODO add window resize event
const onResize = () => {
  if (!iframe) return

  const from = iframe.getBoundingClientRect()
  const to = el.value.getBoundingClientRect()

  const { width, height, x, y } = fit(from, to)

  iframe.style.width = `${width}px`
  iframe.style.height = `${height}px`
  iframe.style.left = `${x}px`
  iframe.style.top = `${y}px`
}

// Expose
defineExpose({ play, pause, load })

</script>

<style scoped>
.AppPlayerVimeo {
  position: relative;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  overflow: hidden;
}

.AppPlayerVimeo:deep(iframe) {
  position: absolute;

  top: 0;
  left: 0;

}
</style>
