<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>

useMetas({ title: 'Features metas' })

</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.Page {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100vh;

  gap: 10px;

  text-align: center;

  font-size: 16px;

  background-color: #161616;
  color: white;
}

a {
  color: white;
}

h1 {
  font-size: 58px;

  text-transform: uppercase;
}
</style>
