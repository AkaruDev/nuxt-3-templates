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

const { preloader } = useTransition()
preloader.preload(useDelay(1))

definePageMeta(useTransition())
</script>

<style scoped></style>
