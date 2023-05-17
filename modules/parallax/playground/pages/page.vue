<template>
  <div class="Page">
    <h1>Page</h1>
    <nuxt-link to="/">
      Go home
    </nuxt-link>

    <div
      v-parallax
      class="Parallax"
    />
  </div>
</template>

<script setup>
</script>

<style scoped>
.Parallax {
  position: relative;
  width: 50vh;
  aspect-ratio: 1;

  background-color: #f1d3fe;

  transform: scaleX(calc((var(--px-progress, 0) * 1.5) + 1));

}
</style>
