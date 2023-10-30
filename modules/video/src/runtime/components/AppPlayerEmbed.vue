<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-if="embed"
    class="AppPlayerEmbed"
    v-html="html"
  />
</template>

<script setup>
const props = defineProps({
  embed: {
    type: String,
    default: undefined
  }
})

const html = computed(() => {
  let modified = props.embed
  if (!modified.includes('loading=')) {
    modified = modified.replace("<iframe", "<iframe loading='lazy'")
  }
  return modified
});


</script>

<style scoped>
.AppPlayerEmbed {
  width: 100%;
  height: 100%;
}

.AppPlayerEmbed:deep(iframe) {
  width: 100%;
  height: 100%;

}
</style>
