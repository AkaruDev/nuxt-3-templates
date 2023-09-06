<template>
  <AppVideo
    class="AppVideoBackground"
    :autoplay="true"
    :muted="true"
    :type="type"
    :src="url"
  >
    <template #cover>
      <img
        v-if="cover"
        class="AppVideoBackground-img"
        :src="cover"
      >
    </template>
  </AppVideo>
</template>

<script setup>
defineProps({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: undefined,
    validator (value) {
      return ['vimeo', 'file'].includes(value)
    }
  },
  cover: {
    type: String,
    default: undefined
  }
})
</script>

<style  scoped>
.AppVideoBackground-img {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  object-fit: cover;
}
</style>
