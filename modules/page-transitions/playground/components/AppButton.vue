<template>
  <button>
    Button
  </button>
</template>

<script setup>
const { preloader } = useTransition()
preloader.preload(useDelay(2))
</script>

<style scoped>
button {
  position: relative;

  margin: 0;
  padding: 5px 15px;

  border: 1px solid black;
  border-radius: 13px;
}
</style>
