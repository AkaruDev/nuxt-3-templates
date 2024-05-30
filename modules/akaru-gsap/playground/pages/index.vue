<template>
  <div class="Page home">
    <h1 ref="title">
      Home
    </h1>
  </div>
</template>

<script setup>

const title = ref()

onMounted(() => {
  tl.to(title.value, { scale: 1.2, duration: 0.8, ease: 'power3.out' }, 0)
})

const onResize = () => {
  // DO something to your timeline
  tl.play(0)
}
const tl = useTimeline(undefined, onResize)
</script>

<style scoped></style>
