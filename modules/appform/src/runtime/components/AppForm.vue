<template>
  <form
    ref="el"
    class="AppForm"
    autocomplete="false"
    :action="action"
    @submit.prevent="onSubmit"
  >
    <slot />
  </form>
</template>

<script setup>
const props = defineProps({
  action: {
    type: String,
    required: true
    // TODO validator for url format
  },
})

const el = ref()

const onSubmit = () => {
  // TODO call action url
  if (!el.value?.reportValidity()) return
  // TODO add fake call to test different scenario, with error managing, messages and loading request.
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
