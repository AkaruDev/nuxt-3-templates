<!-- eslint-disable vue/no-v-html -->
<template>
  <span
    class="AppSvg"
    v-html="currentIcon"
  />
</template>

<script setup>
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
