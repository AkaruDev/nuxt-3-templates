<template>
  <div>
    <NuxtPage class="Page" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.Page {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100vh;

  gap: 10px;

  text-align: center;

  font-size: 16px;

  background-color: #1a1a1a;
  color: white;
}

a {
  color: white;
}

h1 {
  font-size: 36px;

}
</style>
