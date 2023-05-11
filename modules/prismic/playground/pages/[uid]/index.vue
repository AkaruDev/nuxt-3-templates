<template>
  <div class="Page">
    <h1 v-if="api?.hero?.title">
      {{ api.hero.title }}
    </h1>
    <nuxt-link to="/">
      Go home
    </nuxt-link>
  </div>
</template>

<script setup>
import getPage from "@/api/pages/page.js"
const route = useRoute();

const { data: api, error } = await useAsyncData(() => getPage(route.params.uid))
if (error.value) {
  console.warn(error)
  error({ statusCode: 404, message: 'Page not found' })
}
</script>

<style scoped></style>
