<template>
  <AppVideo
    class="AppVideoFile"
    :controls="true"
    :muted="false"
    type="file"
    :src="url"
  >
    <template #cover>
      <img
        v-if="cover"
        class="AppVideoFile-img"
        :src="cover"
      >
    </template>
    <template #btplay>
      <button
        type="button"
        aria-label="Play"
        class="AppVideoFile-btplay"
      />
    </template>
  </AppVideo>
</template>

<script setup>
defineProps({
  url: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    default: undefined
  }
})
</script>

<style  scoped>
.AppVideoFile-img {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  object-fit: cover;
}

.AppVideoFile-btplay {
  width: 0;
  height: 0;

  background-color: transparent;
  border-style: solid;
  border-width: 30px 0 30px 60px;
  border-color: transparent transparent transparent #52427a;

  cursor: pointer;
}
</style>
