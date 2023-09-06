# Readme

## Description
Videos components for vimeo, embed iframe and video files.


## Components

### AppVideoVimeo
AppVideo wrapper for vimeo components and custom controls components.

### AppVideoEmbed
AppVideo wrapper for embed iframe.

### AppVideoFile
AppVideo wrapper for video file components and custom controls components.

### AppVideoBackground
AppVideo wrapper for vimeo or video file for video looping silently in the background.

## Notes

### Viewport observer
If you use [features/viewport-observer](https://github.com/AkaruDev/nuxt-3-templates/tree/features/viewport-observer) you can replace in AppVideo.vue the directive `v-intersection-observer="onIntersectionObserver"` by `v-observe="{onEnter,onLeave,once:false}"`.
Remove `import { vIntersectionObserver } from '@vueuse/components'`

