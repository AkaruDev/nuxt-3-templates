<template>
  <div
    ref="player"
    class="AppPlayerYoutube"
  />
</template>

<script setup>
import YouTubePlayer from 'youtube-player';

const emits = defineEmits(['pause', 'videoend', 'play'])

const props = defineProps({
    url: {
        required: false,
        default: '',
        type: String
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
    }
})

const player = ref()

let YtPlayer

onMounted(() => {
    YtPlayer = YouTubePlayer(player.value, {
        videoId: youtubeId.value,
        width: props.width,
        height: props.height
    })

    // Is setting up an event listener for the YouTube player's state change.
    YtPlayer.on('stateChange', (event) => {
        switch (event.data) {
            case 2:
                onPause()
                break;
            case 1:
                onPlay()
                break;
            case 0:
                videoEnd()
                break;
            default:
                break;
        }
    })
})

const play = () => {
    YtPlayer?.playVideo()
}

const pause = () => {
    YtPlayer?.pauseVideo()
}

const onPause = () => {
    emits('pause')
}

const videoEnd = () => {
    emits('videoend')
}

const onPlay = () => {
    emits('play')
}

// The `youtubeId` constant is a computed property that extracts the YouTube video ID from the `url`
// prop.
const youtubeId = computed(() => {
    if (!props?.url) return
    const url = props.url
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
})

defineExpose({ play, pause });
</script>

<style>
.AppPlayerYoutube {
    width: 100%;
    height: 100%;
}
</style>