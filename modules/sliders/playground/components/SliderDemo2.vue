<template>
  <div class="SliderDemo">
    <h2>AutoScroller:</h2>
    <AppAutoScroller
      v-for="i in 3"
      :key="`autoscroller-${i}`"
      class="Slider"
      :items="items"
      :duration="100"
      :direction="i === 2 ? -1 : 1"
    >
      <template #item="{ item, i }">
        <div
          :id="`item-${i}`"
          class="Slider-item"
        >
          {{ item.label }}
        </div>
      </template>
    </AppAutoScroller>
  </div>
</template>

<script setup>
const items = []
for (let i = 0; i < 5; i++) {
  items.push({ id: i, label: `AKARU AGENCE WEB LYON` })
}


</script>

<style scoped>
.SliderDemo {
  position: relative;

  width: 100%;
  margin-top: 200px;
}

.SliderDemo h2 {
  margin-bottom: 50px;
}

.AppSlider.Slider {
  flex: none;
  width: 100%;

  margin-top: 10px;

  border: solid rgba(255, 255, 255, 0.5);
  border-width: 1px 0 0 0;
}

.AppSlider:last-child {
  border-bottom-width: 1px;
}

.Slider-item {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  min-width: 100%;
  height: 10vh;

  margin: 0 0 0 2vw;

  color: white;
  font-size: 10vh;

  text-align: center;
  white-space: nowrap;

}
</style>
