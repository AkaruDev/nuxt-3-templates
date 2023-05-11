<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <AppSvg
      name="akaru"
      class="Logo"
    />
  </div>
</template>

<script setup>
</script>

<style scoped>
.Logo {
  width: 120px;

  margin-top: 30px;

  fill: white;
}
</style>
