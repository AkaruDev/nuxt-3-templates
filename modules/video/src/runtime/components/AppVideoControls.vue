<template>
  <div class="AppVideoControls">
    <!-- Play/pause -->
    <button
      class="AppVideoControls-bt"
      @click="togglePlayPause"
    >
      <div
        v-show="!state.playing"
        class="AppVideoControls-play"
      />
      <div
        v-show="state.playing"
        class="AppVideoControls-pause"
      />
    </button>
    <!-- Progress bar -->
    <div
      ref="bar"
      class="AppVideoControls-progress"
      @click="onClickProgress"
    />
    <!-- Duration -->
    <div
      ref="bar"
      class="AppVideoControls-duration"
    >
      {{ timing }}
    </div>
    <!-- Sound on/off -->
    <button
      class="AppVideoControls-bt"
      @click="toggleMute"
    >
      <svg
        class="AppVideoControls-muted"
        width="15px"
        height="14px"
        viewBox="0 0 15 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.33333 13.7336L2.46834 9.71019C2.36444 9.6245 2.23348 9.57771 2.09834 9.578H0.576669C0.500799 9.578 0.425676 9.56316 0.355603 9.53432C0.285529 9.50549 0.221884 9.46323 0.168314 9.40996C0.114744 9.3567 0.0723012 9.29348 0.0434192 9.22393C0.0145372 9.15437 -0.000216861 9.07985 2.40858e-06 9.00463V5.57437C2.40858e-06 5.42275 0.0607582 5.27733 0.168904 5.17011C0.27705 5.06289 0.423727 5.00266 0.576669 5.00266H2.09834C2.23348 5.00295 2.36444 4.95616 2.46834 4.87048L7.33333 0.845371C7.50175 0.705703 7.70687 0.616599 7.92461 0.588527C8.14234 0.560456 8.36363 0.594585 8.56247 0.686904C8.76132 0.779224 8.92945 0.925897 9.0471 1.10968C9.16476 1.29347 9.22705 1.50674 9.22667 1.72442V12.8546C9.22705 13.0722 9.16476 13.2855 9.0471 13.4693C8.92945 13.6531 8.76132 13.7998 8.56247 13.8921C8.36363 13.9844 8.14234 14.0185 7.92461 13.9905C7.70687 13.9624 7.50175 13.8733 7.33333 13.7336ZM8.07167 1.72607L3.20667 5.74787C2.89536 6.00466 2.50331 6.14552 2.09834 6.14608H1.15334V8.43292H2.09834C2.50336 8.43321 2.8955 8.5741 3.20667 8.83114L8.07667 12.8546L8.07167 1.72607Z"
          fill="white"
        />
        <path
          v-show="!state.muted"
          d="M11.5383 11.8648H12.6917V2.71414H11.5383V11.8648Z"
          fill="white"
        />
        <path
          v-show="!state.muted"
          d="M13.8467 10.7214H15V3.85756H13.8467V10.7214Z"
          fill="white"
        />
      </svg>
    </button>

    <!-- Fullscreen -->
    <button
      class="AppVideoControls-bt"
      @click="toggleFullscreen"
    >
      <svg
        width="15px"
        height="15px"
        class="AppVideoControls-fullscreen"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 12"
      >
        <path
          fill="white"
          d="M1.33333 1.33333h3.33334V0H0v4.66667h1.33333V1.33333zm3.33334 9.33337H1.33333V7.33333H0V12h4.66667v-1.3333zM12 7.33333h-1.3333v3.33337H7.33333V12H12V7.33333zm-1.3333-2.66666H12V0H7.33333v1.33333h3.33337v3.33334z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  state: {
    type: Object,
    default: () => {
      return {
        muted: true,
        playing: false,
        fullscreen: false,
      }
    }
  }
})

const bar = ref()

const formatSeconds = (seconds) => {
  return new Date(seconds * 1000).toISOString().slice(14, 19)
}

const timing = computed(() => {
  const currentTime = (props.progress * props.duration)
  return `${formatSeconds(currentTime)} / ${formatSeconds(props.duration)}`
})

const events = {
  change: 'change'
}
const emit = defineEmits(['change'])

const togglePlayPause = () => {
  emit(events.change, { togglePlayPause: true })
}
const toggleMute = () => {
  emit(events.change, { toggleMute: true })
}
const toggleFullscreen = () => {
  emit(events.change, { toggleFullscreen: true })
}

/**
 * @param {MouseEvent} event
 */
const onClickProgress = (event) => {
  const progress = event.offsetX / bar.value.clientWidth
  emit(events.change, { progress })
}


</script>

<style  scoped>
button {
  cursor: pointer;
  appearance: none;
  outline: 0;
  border: 0;
  padding: 0;
  background: none;
  color: white;
}

.AppVideoControls {
  position: absolute;
  display: flex;

  align-items: center;

  width: 100%;

  bottom: 0;
  left: 0;

  padding: 0 20px;

  box-sizing: border-box;

  color: white;
}

.AppVideoControls::before {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  pointer-events: none;

  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 70%);

  z-index: 0;

  content: '';
}

.AppVideoControls-bt {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 50px;
  height: 50px;
  z-index: 1;
}

.AppVideoControls-play {
  position: absolute;
  width: 0;
  height: 0;

  top: 50%;
  left: 50%;

  border-style: solid;
  border-width: 8px 0 8px 14px;
  border-color: transparent transparent transparent white;

  transform: translate3d(-50%, -50%, 0);
}

.AppVideoControls-pause {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  gap: 5px;

  top: 0;
  left: -2px;
}

.AppVideoControls-pause::before,
.AppVideoControls-pause::after {
  width: 3px;
  height: 14px;

  background-color: white;
  border-radius: 1px;

  content: '';
}


.AppVideoControls-progress {
  position: relative;
  width: 100%;
  height: 50px;

  cursor: pointer;

  z-index: 1;
}

.AppVideoControls-progress::before,
.AppVideoControls-progress::after {
  position: absolute;
  width: 100%;
  height: 1px;

  top: 50%;
  left: 0;

  content: "";
}

.AppVideoControls-progress::before {
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 0;
}

.AppVideoControls-progress::after {
  background-color: #9987c7;

  transform-origin: 0;
  transform: scaleX(v-bind('props.progress'));
  z-index: 1;
}

.AppVideoControls-duration {
  display: block;
  font-size: 11px;
  font-family: sans-serif;

  padding: 0 10px;

  text-align: center;
  white-space: nowrap;
}

.AppVideoControls-muted {
  position: relative;
  left: 5px;
}
</style>
