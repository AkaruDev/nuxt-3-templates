<template>
  <form ref="el" class="AppForm" autocomplete="false" @submit.prevent="onSubmit" :action="action">
    <slot/>
  </form>
</template>

<script setup>
const props = defineProps({
  action: {
    type: String,
    required: true
    // TODO validator for url format
  }
})

const el = ref()

const onSubmit = () => {
  // TODO call action url
  if (!el.value?.reportValidity()) return
}

</script>

<style scoped>
.AppForm {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;

  gap: 20px;
}
</style>
