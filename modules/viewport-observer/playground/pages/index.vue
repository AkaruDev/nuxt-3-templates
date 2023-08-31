<template>
  <div class="Page Home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <div
      id="ObserveDebugger1"
      v-observe="{ onEnter, onLeave }"
      class="ObserveDebugger"
    />
    <div
      id="ObserveDebugger2"
      v-observe="{ once: false, onEnter, onLeave, offset: 600 }"
      class="ObserveDebugger"
    />
  </div>
</template>

<script setup>
/*
const { $viewportObserver } = useNuxtApp()

onMounted(() => {
  setTimeout(() => {
    $viewportObserver.active.value = false
  }, 1000);
}) */

const onEnter = () => {
  console.info("onEnter")
}
const onLeave = () => {
  console.info("onLeave")
}
</script>

<style scoped>
.Page.Home {
  padding-bottom: 101vh;
}

.ObserveDebugger {
  width: 100%;
  height: 50vh;

  background-color: blue;
}

.ObserveDebugger.--in-view {
  background-color: yellow;
}
</style>
