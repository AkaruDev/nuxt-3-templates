<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <AppSlider class="Slider" :items="items">
      <template #item="{ item, i }">
        <div class="Slider-item" :id="`item-${i}`">{{ item.label }}</div>
      </template>
    </AppSlider>
  </div>
</template>

<script setup>

const items = []
for (let i = 0; i < 5; i++) {
  items.push({ id: i, label: `slider-${i}` })

}

// TODO debug using Houlahoop implementation
</script>

<style scoped>
.Page {
  min-height: 300vh;

  overflow: hidden;
}

.AppSlider.Slider {
  position: relative;
  width: 100%;
  height: 500px;
}

.Slider-item {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 40vw;
  height: 100%;

  top: 0;
  left: 0;

  color: #121212;
}

#item-0 {
  background-color: #fff3a4;
}

#item-1 {
  background-color: #ecd3fa;
}

#item-2 {
  background-color: #a4c8ff;
}
</style>
