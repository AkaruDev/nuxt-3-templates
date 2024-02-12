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
        <span>Sticky element 1</span>
        <span>Progress: {{ progress1 }}%</span>
      </div>
      <div
        id="sticky-2"
        v-scroll-sticky
        class="Sticky"
      >
        <span>Sticky element 2</span>
      </div>
    </div>
  </div>
</template>

<script setup>

const progress1 = ref(0)

const onProgress = ({ progress }) => {//{ el, progress }
  // console.info(progress, el)
  progress1.value = Math.floor(progress * 100)
}
</script>

<style  scoped>
h1 {
  padding: 10vh 0 0 0;
}

.Page {
  padding: 30px 30px 100vh 30px;

}

.Sticky-parent {
  position: relative;

  width: 100%;
  max-width: 920px;
  height: 200vh;
  background-color: rgb(231, 221, 185);
  color: #131313;

  padding: 80px 40px;

  margin-top: 200px;

  overflow: hidden;
}

.Sticky {
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 20vw;
  height: 20vh;

  top: 130px;
  left: calc(50% - 10vw);

  background-color: rgb(169, 169, 255);
}

#sticky-2 {
  width: 30vw;
  top: 300px;
  left: calc(50% - 15vw);
  background-color: rgb(208, 194, 243);
}
</style>
