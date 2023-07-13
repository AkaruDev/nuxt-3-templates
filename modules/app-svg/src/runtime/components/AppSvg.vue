
<template>
  <span class="AppSvg">
    <client-only>
      <span
        v-html="currentIcon"
        class="AppSvg-icon"
      />
      <template #fallback />
    </client-only>
  </span>
</template>

<script setup>

import { useRuntimeConfig } from "#app";

const props = defineProps({
  name: { type: String, required: true }
})

// Auto-load icons
const icons = Object.fromEntries(
  Object.entries(import.meta.glob('~/assets/svg/*.svg', { as: 'raw' })).map(
    ([key, value]) => {
      const filename = key.split('/').pop().split('.').shift()
      return [filename, value]
    },
  ),
)
const currentIcon = await icons[props.name]?.()

</script>
