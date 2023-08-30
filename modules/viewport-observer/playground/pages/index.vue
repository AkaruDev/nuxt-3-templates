<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>
  </div>
</template>

<script setup>

const { $viewportObserver } = useNuxtApp()

onMounted(() => {
  console.info($viewportObserver.active.value)
})
</script>

<style scoped></style>
