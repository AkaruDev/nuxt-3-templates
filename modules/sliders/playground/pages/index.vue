<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <SliderDemo1 />
    <SliderDemo2 />
  </div>
</template>

<script setup>

</script>

<style scoped>
.Page {
  min-height: 300vh;

  overflow: hidden;
}
</style>
