<template>
  <div v-scroll-container>
    <CustomScrollBar />
    <NuxtPage class="Page" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  ::-webkit-scrollbar {
    width: 0;
    /* Remove scrollbar space */
    background: transparent;
    /* Optional: just make scrollbar invisible */
  }
}

html,
body {
  overscroll-behavior: none;
}

html.lenis {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}



.Page {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;

  width: 100%;
  min-height: 200vh;

  padding-top: 200px;
  gap: 10px;

  text-align: center;

  font-size: 16px;

  background-color: #161616;
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
