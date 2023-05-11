
<template>
  <span class="AppIcon">
    <client-only>
      <component
        :is="currentIcon"
        class="AppIcon-icon"
      />
      <template #fallback />
    </client-only>
  </span>
</template>

<script setup>

const props = defineProps({
  name: { type: String, required: true }
})

const currentIcon = computed(() =>
  defineAsyncComponent({
    loader: () => import(`../assets/svg/${props.name}.svg`),
    loadingComponent: {
      template: '<span></span>',
    },
    errorComponent: {
      template: '<span>error</span>',
    },
    delay: 200,
    timeout: 3000,
    suspensible: true,
  })
)
</script>
