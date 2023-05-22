<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: sliders
- Description: My new Nuxt module
-->

# My Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

My new Nuxt module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/sliders?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Foo
- 🚠 &nbsp;Bar
- 🌲 &nbsp;Baz

## Quick Setup

1. Add `sliders` dependency to your project

```bash
# Using pnpm
pnpm add -D sliders

# Using yarn
yarn add --dev sliders

# Using npm
npm install --save-dev sliders
```

2. Add `sliders` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'sliders'
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
[npm-version-src]: https://img.shields.io/npm/v/sliders/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/sliders

[npm-downloads-src]: https://img.shields.io/npm/dm/sliders.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/sliders

[license-src]: https://img.shields.io/npm/l/sliders.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/sliders

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
