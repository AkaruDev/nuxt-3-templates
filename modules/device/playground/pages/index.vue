<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <h2>Device: </h2>
    <ul>
      <li
        v-for="value in activeValues"
        :key="value"
      >
        {{ value }}
      </li>

      <li>Gpu tier {{ tier }} - {{ tiers[tier] }}</li>
    </ul>
  </div>
</template>

<script setup>
const device = useDevice()
const gpuTier = await device.getGpuTier()
const tier = ref(gpuTier)

const tiers = ['Unknow 0fps', 'Low 15fps', 'Middle 30fps', 'High 60fps']

const activeValues = computed(() => {
  const values = []
  Object.entries(device).forEach(([key, entry]) => {
    if (entry?.value) {
      values.push(key)
    }
  })

  return values
})
</script>

<style scoped>
h2 {
  width: 200px;

  margin-top: 50px;
  margin-bottom: 30px;
}

ul {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 15px;
}
</style>
