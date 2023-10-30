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

### AppPlayerYoutube
Use the ``youtube-player`` [library](https://github.com/gajus/youtube-player#readme) to access certain events from the iframe.

It creates a YouTube player object and loads a video with its ID, all options are available on [library doc](https://github.com/gajus/youtube-player#readme)

#### Props
- ``url`` url of video (embed or link from youtube)
- ``width`` width set to the player
- ``height`` height set to the player

#### Events
- ``@play`` video is play
- ``@pause`` video is paused
- ``@videoend`` video has reach the end

Event are listen based on the [YouTube Iframe API documentation](https://developers.google.com/youtube/iframe_api_reference?hl=fr#Events)

#### Examples
With ``AppVideo``
```
      <AppVideo
        src="https://www.youtube.com/watch?v=nymgT8zIIco"
        type="youtube"
        :width="1920"
        :height="1080"
      />
```
With ``AppPlayerYoutube``
```
      <AppPlayerYoutube
        ref="player"
        :url="src"
        :height="height"
        :width="width"
        @play="onPlay"
        @pause="onPause"
      />
```
## Notes

### Viewport observer
If you use [features/viewport-observer](https://github.com/AkaruDev/nuxt-3-templates/tree/features/viewport-observer) you can replace in AppVideo.vue the directive `v-intersection-observer="onIntersectionObserver"` by `v-observe="{onEnter,onLeave,once:false}"`.
Remove `import { vIntersectionObserver } from '@vueuse/components'`

