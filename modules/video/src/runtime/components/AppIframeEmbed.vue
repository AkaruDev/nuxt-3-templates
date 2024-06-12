<!-- eslint-disable vue/no-v-html -->
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
      v-if="state.loaded"
      class="AppVideo-player"
      v-html="html"
    />
  </div>
</template>

<script setup lang="ts">
import { VideoState as VideoStateType } from '../types/videoState';

const props = defineProps({
  embed: {
    type: String,
    default: undefined
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
const state = ref<VideoStateType>({
  loaded: false
})

// Computed
const html = computed(() => {
  let modified = props.embed
  if (modified && !modified.includes('loading=')) {
    modified = modified.replace("<iframe", "<iframe loading='lazy'")
  }
  return modified
});

// Methods
const onClickPlay = () => {
  state.value.loaded = true
}

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
