<template>
  <div class="Page Home">
    <h1>Home</h1>
    <AppForm
      action="#"
      class="Home-form"
    >
      <AppInput
        :required="true"
        label="Name"
        placeholder="What is your name?"
        type="text"
        name="name"
      />
      <AppInput
        :required="true"
        label="Message"
        placeholder="Write a comment"
        type="textarea"
        name="message"
      />
      <AppInput
        type="hidden"
        value="i'm hidden hehe"
      />
      <button type="submit">
        Send
      </button>
    </AppForm>
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
