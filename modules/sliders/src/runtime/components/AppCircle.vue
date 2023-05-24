<template>
  <svg
    width="100%"
    height="100%"
    class="AppCircle"
    :style="{ '--thickness': thickness + '%' }"
  >
    <circle
      ref="circle"
      class="AppCircle-circle"
      :r="radius"
      cx="50%"
      cy="50%"
      :style="{
        stroke: color,
        strokeDasharray: `${circumference}% ${circumference}%`,
        strokeDashoffset: `${progressComputed}%`,
      }"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: 'white'
  },
  thickness: {
    type: Number,
    default: 2
  }
})
const circumference = computed(() => {
  return (50 - props.thickness * 0.5) * 2 * Math.PI
})
const radius = computed(() => {
  return (50 - props.thickness * 0.5) + '%'
})
const progressComputed = computed(() => {
  return circumference * (1 - props.progress)
})
</script>

<style scoped>
.AppCircle {
  transform: rotate(-90deg);
}

.AppCircle-circle {
  stroke-width: var(--thickness, 2%);
  stroke-linecap: butt;

  fill: transparent;
}
</style>
