<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: video
- Description: My new Nuxt module
-->

# My Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

My new Nuxt module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/video?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- Vimeo player
- File player
- Embed player
- YouTube player

## Quick Setup

1. Add `video` dependency to your project

```bash
# Using pnpm
pnpm add -D video

# Using yarn
yarn add --dev video

# Using npm
npm install --save-dev video
```

2. Add `video` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'video'
  ]
})
```

That's it! You can now use My Module in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/video/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/video

[npm-downloads-src]: https://img.shields.io/npm/dm/video.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/video

[license-src]: https://img.shields.io/npm/l/video.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/video

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com

# Features informations

## YouTube player
Use the ``youtube-player`` [library](https://github.com/gajus/youtube-player#readme) to get access to some events from iframe.

It create a youtube player Object and load a video with his ID, all options are available on [library doc](https://github.com/gajus/youtube-player#readme)

### Props
- ``url`` url of video (embed or link from youtube)
- ``width`` width set to the player
- ``height`` height set to the player

### Events
- ``@play`` video is play
- ``@pause`` video is paused
- ``@videoend`` video has reach the end

Event are listen based on the [YouTube Iframe API documentation](https://developers.google.com/youtube/iframe_api_reference?hl=fr#Events)

### Example
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