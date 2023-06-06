<template>
  <div class="AppVideoControls">
    <!-- TODO play/pause -->
    <!-- TODO progress bar -->
    <!-- TODO fullscreen -->
    <!-- TODO sound on/off -->
  </div>
</template>

<script setup>

const props = defineProps({
  mute: {
    type: Boolean,
    default: true
  },
  playing: {
    type: Boolean,
    default: false
  }
})

const state = ref({
  mute: props.mute,
  playing: props.playing,
  fullscreen: false,
})

const events = {
  change: 'change'
}
const emit = defineEmits(['change'])

const togglePlayPause = () => {
  state.value.playing = !state.value.playing
  emit(events.change, state.value)
}
const toggleVolume = () => {
  state.value.mute = !state.value.mute
  emit(events.change, state.value)
}
const toggleFullscreen = () => {
  state.value.fullscreen = !state.value.fullscreen
  emit(events.change, state.value)
}

// TODO progress method on drag pls

</script>

<style scoped></style>
