<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <div
      v-parallax="{ onProgress }"
      class="Parallax"
    />
    <div
      v-parallax
      class="Parallax"
      :style="{ backgroundColor: '#feeed3' }"
    />
    <div
      v-parallax
      class="Parallax"
      :style="{ backgroundColor: '#d3fef7' }"
    />
  </div>
</template>

<script setup>

const onProgress = ({ el, progress }) => {
  // console.info(el, progress)
}
</script>

<style scoped>
.Page {
  position: relative;
  justify-content: flex-start;
  height: 500vh;

  gap: 100px;

  overflow: hidden;
}

.Parallax {
  position: relative;
  width: 50vh;
  aspect-ratio: 1;

  background-color: #f1d3fe;

  transform: scaleX(calc((var(--plx-progress, 0) * 1.5) + 1));

}
</style>
