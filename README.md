# VirtualScroll

Add directives an components to integrate VirtualScroll to your project


## Features

- VirtualScroll with scrollbar
- Sticky directive

## Quick Setup

1. Add `virtual-scroll` dependency to your project

```bash
# Using pnpm
pnpm add -D virtual-scroll

# Using yarn
yarn add --dev virtual-scroll

# Using npm
npm install --save-dev virtual-scroll
```

2. Add `virtual-scroll` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'virtual-scroll'
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
