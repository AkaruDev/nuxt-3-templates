<template>
  <div class="Page Home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <div
      id="ObserveDebugger1"
      v-observe="{ once: true, onEnter }"
      class="ObserveDebugger"
    />
    <div
      id="ObserveDebugger2"
      v-observe="{ once: false }"
      class="ObserveDebugger"
    />
  </div>
</template>

<script setup>

const { $viewportObserver } = useNuxtApp()

onMounted(() => {
  setTimeout(() => {
    $viewportObserver.active.value = true
  }, 1000);
})

const onEnter = () => {
  console.info("onEnter")
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
