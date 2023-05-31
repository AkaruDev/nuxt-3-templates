<template>
  <div class="Page">
    <h1>Page</h1>
    <nuxt-link to="/">
      Go home
    </nuxt-link>
  </div>
</template>

<script setup>

const url = 'https://dog.ceo/api/breeds/image/random'
const { data, error } = useAsyncData(() =>
  fetch(url)
    .then(response => response.json())
    .then(json => {
      return {
        title: 'Page test',
        image: json.message
      }
    })
)
if (error.value) {
  console.warn(error)
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useMetas(data.value)
</script>

<style scoped></style>
