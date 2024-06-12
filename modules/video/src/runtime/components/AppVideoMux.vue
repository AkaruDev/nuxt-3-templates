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
      @timeupdate="video.onTimeUpdate"
      @canplay="video.onPlayPauseUpdate"
      @playing="video.onPlayPauseUpdate"
      @pause="video.onPlayPauseUpdate"
    />

    <!-- Cover -->
    <div
      class="AppVideo-cover"
    >
      <slot
        v-if="!props.muxCover"
        name="cover"
      />
      <img
        v-else-if="muxCoverSrc"
        loading="lazy"
        :src="muxCoverSrc"
      >
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
import { MuxVideo as MuxVideoType } from '../types/muxVideo';

// Props
const props = defineProps({
  video: {
    type: Object as PropType<MuxVideoType>,
    required: true
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
  muxCover: {
    required: false,
    default: false,
    type: Boolean
  },
})

// Refs
const refEl = ref<HTMLDivElement | null>(null);
const refVideo = ref<HTMLVideoElement | null>(null);

// Events
const emit = defineEmits(['onPlay', 'onPause', 'onStop', 'onProgress', 'onLoaded'])

// Append video
const { appendVideo } = useMuxStream({
  muxVideo: props.video,
  videoEl: refVideo,
  preferMp4: true,
  useSmallResolution: false,
})

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
const videoWidth: ComputedRef<number | undefined> = computed(() => {
  const videoTrack = props.video.asset?.data.tracks?.find(
    (el) => el.type === 'video'
  );
  return videoTrack ? videoTrack.max_width : undefined;
});

const videoHeight: ComputedRef<number | undefined> = computed(() => {
  const videoTrack = props.video.asset?.data.tracks?.find(
    (el) => el.type === 'video'
  );
  return videoTrack ? videoTrack.max_height : undefined;
});

const aspectRatioStyle: ComputedRef<string | null> = computed(() =>
  videoWidth.value && videoHeight.value
    ? `${videoWidth.value}/${videoHeight.value}`
    : null
);

// Cover
const muxCoverSrc: ComputedRef<string | undefined> = computed(() => {
  if (props.muxCover) {
    return props.video.asset?.playbackId
      ? `https://image.mux.com/${props.video.asset.playbackId}/thumbnail.jpg?time=${props.video.asset.thumbTime ?? 0}`
      : '';
  }
  return undefined;
});

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

.AppVideo-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
