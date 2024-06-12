<template>
  <div
    ref="refEl"
    class="AppVideo"
    :class="[
      video.state?.playing && '--is-playing',
      video.state?.fullscreen && '--fullscreen',
      video.isCoverHidden && '--cover-hidden',
      `--fit-${props.fit}`
    ]"
    :style="[aspectRatioStyle ? { 'aspect-ratio': aspectRatioStyle } : '']"
  >
    <!-- Video -->
    <video
      ref="refVideo"
      class="AppVideo-video"
      :preload="props.preload"
      playsinline
      :loop="props.loop"
      :muted="props.muted"
      :data-src="props.src"
      @timeupdate="video.onTimeUpdate"
      @canplay="video.onPlayPauseUpdate"
      @playing="video.onPlayPauseUpdate"
      @pause="video.onPlayPauseUpdate"
    >
      <source
        v-for="(item, i) in sources"
        :key="`video-${i}`"
        :data-src="`${src}`"
        :type="item.type"
      >
    </video>

    <!-- Cover -->
    <div
      class="AppVideo-cover"
    >
      <slot name="cover" />
    </div>

    <!-- Controls -->
    <AppVideoControls
      v-if="props.controls"
      v-show="video.isCoverHidden"
      :class="{ '--show': video.isCoverHidden }"
      :state="video.state"
      :progress="video.progress || 0"
      :duration="video.duration || 0"
      class="AppVideo-controls"
      @change="video.onControlsChange"
    />

    <!-- Play Button -->
    <AppVideoPlayButton
      v-if="props.controls"
      class="AppVideo-btplay"
      @click="video.togglePlayPause"
    />
  </div>
</template>

<script setup lang="ts">
interface Source {
  url: string;
  type?: string;
}

// Props
const props = defineProps({
  src: {
    type: String,
    default: '',
    required: false
  },
  sources: {
    type: Array as PropType<Source[]>,
    default: () => [],
    required: false
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  loop: {
    type: Boolean,
    default: true
  },
  muted: {
    type: Boolean,
    default: true
  },
  preload: {
    type: String,
    default: 'metadata',
    validate: () => ['metadata', 'none', 'auto']
  },
  loading: {
    type: String,
    default: () => 'lazy',
    validate: () => ['lazy', 'onMounted', 'none']
  },
  controls: {
    type: Boolean,
    default: () => false,
  },
  fit: {
    type: String,
    default: 'cover',
    validate: () => ['cover', 'contain']
  },
  toggleCover: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    required: false,
    default: null
  },
  height: {
    type: Number,
    required: false,
    default: null
  },
})

// Refs
const refEl = ref<HTMLDivElement | null>(null);
const refVideo = ref<HTMLVideoElement | null>(null);

// Events
const emit = defineEmits(['onPlay', 'onPause', 'onStop', 'onProgress', 'onLoaded'])

// Append video
const appendVideo = () => {
  if (!props.sources || props.sources.length === 0) {
    if (refVideo.value) refVideo.value.src = `${props.src}`
  } else {
    const sources = refVideo.value?.querySelectorAll('source')
    props.sources.forEach((item, index) => {
      if (sources && sources[index]) sources[index].setAttribute('src', `${item.url}`)
    })
  }
}

// UseVideo
const video = reactive(useVideo(
  {
    refEl,
    refVideo,
    muted: props.muted,
    autoplay: props.autoplay,
    loading: props.loading,
    toggleCover: props.toggleCover,
    appendVideo: appendVideo,
    emit: emit
  })
)

// Dimensions
const videoWidth: ComputedRef<number> = computed(() => {
  return props.width;
});

const videoHeight: ComputedRef<number> = computed(() => {
  return props.height;
});

const aspectRatioStyle: ComputedRef<string | null> = computed(() =>
  videoWidth.value && videoHeight.value
    ? `${videoWidth.value}/${videoHeight.value}`
    : null
);

// Expose
defineExpose({ play: video.play, pause: video.pause, stop: video.stop, mute: video.mute, unmute: video.unmute, setVolume: video.setVolume, setCurrentTime: video.setCurrentTime, promiseLoadVideo: video.promiseLoadVideo })
</script>

<style scoped>
.AppVideo {
  width: 100%;
  position: relative;
  overflow: hidden;
  font-size: 0;
}

.AppVideo-video {
  position: relative;
  width: 100%;
  height: 100%;
}

/* States */
.AppVideo.--cover-hidden .AppVideo-cover {
  opacity: 0;
  pointer-events: none
}

.AppVideo.--cover-hidden .AppVideo-btplay {
  opacity: 0;
}

/* Fit */
.AppVideo.--fit-cover .AppVideo-video {
  object-fit: cover;
}

.AppVideo.--fit-contain .AppVideo-video {
  object-fit: contain;
}

/* Cover */
.AppVideo-cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: opacity 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

/* Controls */
.AppVideo-controls {
  z-index: 40;
  transform: translate3d(0, 100%, 0);
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.AppVideo:hover .AppVideo-controls {
  transform: translate3d(0, 0, 0);
}
</style>
