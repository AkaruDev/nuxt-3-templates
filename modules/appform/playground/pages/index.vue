<template>
  <div class="Page home">
    <h1>Home</h1>
    <AppForm action="#">
      <AppInput
        :required="true"
        label="Name"
        placeholder="What is your name?"
        type="text"
      />
      <AppInput
        :required="true"
        label="Message"
        placeholder="Write a comment"
        type="textarea"
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
</style>
