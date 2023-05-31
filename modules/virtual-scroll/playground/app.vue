<template>
  <div v-scroll-container>
    <VirtualScrollBar />
    <div v-scroll-section>
      <NuxtPage />
    </div>
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

  overflow: hidden;

  font-size: 16px;

  background-color: #131313;
  color: white;
}

a {
  color: white;
}

h1 {
  font-size: 58px;

  text-transform: uppercase;
}
</style>
