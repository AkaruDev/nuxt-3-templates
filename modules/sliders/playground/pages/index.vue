<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <AppSlider
      class="Slider"
      :items="items"
    >
      <template #item="{ item, i }">
        <div
          :id="`item-${i}`"
          class="Slider-item"
        >
          {{ item.label }}
        </div>
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
  width: 100%;
}

.Slider-item {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 40vw;
  height: 500px;

  margin-right: 1rem;


  background-color: #fff3a4;
  color: #121212;
}
</style>
