<template>
  <div class="Page home">
    <h1>Home</h1>
    <AppForm>
      <AppInput :required="true" label="Name" placeholder="What is your name?" type="text"/>
      <AppInput :required="true" label="Message" placeholder="Write a comment" type="textarea"/>
      <AppInput type="hidden" value="i'm hidden hehe"/>
    </AppForm>
  </div>
</template>

<script setup>
</script>

<style scoped></style>
