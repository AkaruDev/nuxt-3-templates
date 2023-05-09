<template>
  <div class="Page home">
    <h1>Virtual scroll</h1>

    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <div class="Sticky-parent">
      <div>
        Sticky parent
      </div>
      <div
        id="sticky-1"
        v-scroll-sticky="{ onProgress }"
        class="Sticky"
      >
        <span>Sticky element</span>
        <span>Progress: {{ progress1 }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>

const progress1 = ref(0)

const onProgress = ({ el, progress }) => {
  // console.info(progress, el)
  progress1.value = Math.floor(progress * 100)
}
</script>

<style  scoped>
h1 {
  padding: 30vh 0;
}

.Page {
  padding: 30px 0 100vh 30px;
}

.Sticky-parent {
  position: relative;

  width: 100%;
  max-width: 920px;
  height: 200vh;
  background-color: rgb(255, 242, 200);

  padding: 80px 40px;

  overflow: hidden;
}

.Sticky {
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 20vh;
  height: 20vh;

  top: 130px;
  left: calc(50% - 10vh);

  background-color: rgb(169, 169, 255);
}
</style>
