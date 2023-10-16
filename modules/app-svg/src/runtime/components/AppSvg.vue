<!-- eslint-disable vue/no-v-html -->
<template>
  <span
    ref="el"
    class="AppSvg"
    v-html="currentIcon"
  />
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true }
})

const el = ref()
const currentIcon = ref()

defineExpose({ el })

// Auto-load icons
const icons = Object.fromEntries(
  Object.entries(import.meta.glob('~/assets/svg/*.svg', { as: 'raw' })).map(
    ([key, value]) => {
      const filename = key.split('/').pop().split('.').shift()
      return [filename, value]
    },
  ),
)

currentIcon.value = await icons[props.name]?.()

watch(() => props.name, async (newName) => {
  currentIcon.value = await icons[newName]?.()
})

onMounted(async () => {
  currentIcon.value = await icons[props.name]?.()
})



</script>

<style lang="scss" scoped>
.AppSvg {

  &:deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
