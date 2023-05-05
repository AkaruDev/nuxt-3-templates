<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>
    <AppButton />
  </div>
</template>

<script setup>

const { preloader, busTransition } = useTransition()
preloader.preload(useDelay(0.1))
preloader.preload(useDelay(0.2))
preloader.preload(useDelay(0.3))


const onTransitionEnterDone = () => {
  console.info('onTransitionEnterDone')
}

onBeforeMount(() => {
  busTransition.on('transition:enter:done', onTransitionEnterDone)
})

onBeforeUnmount(() => {
  busTransition.off('transition:enter:done', onTransitionEnterDone)
})

definePageMeta(useTransition())

</script>

<style scoped></style>
