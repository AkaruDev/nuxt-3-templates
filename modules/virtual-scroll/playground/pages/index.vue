<template>
  <div class="Page home">
    <h1>Virtual scroll</h1>

    <div class="Sticky-parent">
      <div
        id="sticky-1"
        v-scroll-sticky="{ onProgress }"
        class="Sticky"
      >
        {{ progress }}%
      </div>
    </div>
    <div class="Sticky-parent">
      <div
        id="sticky-2"
        v-scroll-sticky="{ onProgress }"
        class="Sticky"
      >
        {{ progress }}%
      </div>
    </div>
  </div>
</template>

<script setup>

const progress = ref(0)

const onProgress = (p) => {
  progress.value = Math.floor(p * 100)
}
</script>

<style  scoped>
h1 {
  padding: 30vh 0;
}

.Sticky-parent {
  position: relative;
  width: 100%;
  height: 300vh;
  background-color: rgb(245, 255, 169);

  overflow: hidden;
}

.Sticky-parent:nth-child(2) {
  background-color: rgb(255, 225, 169);
}

.Sticky {
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 20vh;
  height: 20vh;

  top: 20px;
  left: calc(50% - 100px);

  background-color: rgb(169, 169, 255);
}

#sticky-2 {
  background-color: rgb(186, 255, 197);

}
</style>
