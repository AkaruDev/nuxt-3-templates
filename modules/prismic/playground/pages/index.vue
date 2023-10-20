<template>
  <div class="Page home">
    <h1 v-if="api?.hero?.title">
      {{ api.hero.title }}
    </h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <PrismicLink
      v-if="api?.hero?.link"
      :field="api.hero.link"
    >
      link test
    </PrismicLink>

    <prismic-rich-text
      :field='api.hero.text2'
    />
  </div>
</template>

<script setup>
import getHome from "@/api/pages/home.js";

const { data: api, error } = await useAsyncData(getHome);

if (!api || error.value) {
  console.warn(error.value);
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}
</script>

<style scoped></style>
