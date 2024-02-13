<template>
  <div class="Page home">
    <h1>Home</h1>

    <AppImage v-if="dog" :url="dog" :width="300" :height="300" :style="{ width: '300px', height: '300px' }" loading="eager" placeholder="none"/>
    <AppImage v-if="dog" :url="dog" :width="300" :height="300" :style="{ width: '300px', height: '300px' }" placeholder="none"/>
    <AppImage url="/doggo.jpg" :width="300" :height="300" :style="{ width: '300px', height: '300px' }" placeholder="blur"/>
  </div>
</template>

<script setup>
const dog = ref(null)
await fetch('https://dog.ceo/api/breed/beagle/images/random').then(rs => rs.json()).then(data => {
  dog.value = data?.message
})
</script>

<style scoped>
.Page {
  min-height: 200vh;
}
</style>
