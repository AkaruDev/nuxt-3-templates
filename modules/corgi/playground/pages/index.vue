<template>
  <div class="Home">
    <CorgiCanvas class="Home-canvas" />
    <article>
      <h1>Home</h1>
      <nuxt-link to="/page">
        Go to page
      </nuxt-link>
    </article>
  </div>
</template>

<script setup>
</script>

<style scoped>
.Home {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  z-index: 0;
}

.Home article {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  gap: 10px;

  z-index: 1;
}

.Home-canvas {
  position: absolute;

  top: 0;
  left: 0;

  z-index: 0;
}
</style>
