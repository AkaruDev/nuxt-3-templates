<template>
  <div class="Page">
    <h1>Page</h1>
    <nuxt-link to="/">
      Go home
    </nuxt-link>

    <AppButton />
  </div>
</template>

<script setup>

const preloader = usePreloader()
preloader.preload(useDelay(1))

</script>

<style scoped></style>
