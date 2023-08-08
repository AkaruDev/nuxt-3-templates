<!-- eslint-disable vue/no-v-html -->
<template>
  <span
    v-if="currentIcon"
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

// Set icon, watch when props change to reset it
// eslint-disable-next-line vue/no-setup-props-destructure
const icon = await icons[props.name]?.()
const currentIcon = ref(icon)

watch(() => props.name, async (newName) => {
  currentIcon.value = await icons[newName]?.()
}
)

</script>
