<template>
  <div class="Page Home">
    <h1>Home</h1>
    <AppForm
      action="/.netlify/functions/form"
      class="Home-form"
      button="Submit"
      :inputs="[
        {
          required: true,
          label: 'Name',
          placeholder: 'What is your name?',
          type: 'text',
          name: 'name',
        },
        {
          required: true,
          label: 'Message',
          placeholder: 'Write a comment',
          type: 'textarea',
          name: 'message',
        }
      ]"
    />
  </div>
</template>

<script setup>
</script>

<style scoped>
button {
  align-self: flex-end;
  padding: 10px 20px;
}

.Home-form {
  margin-top: 50px;
  width: 350px;
}
</style>
