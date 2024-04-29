<template>
  <div class="Page">
    <div
      ref="plane"
      class="Plane"
    />
    <div
      ref="plane2"
      class="Plane"
    />
    <div
      ref="plane3"
      class="Plane"
    />
  </div>
</template>


<script setup>
import { Color, MeshBasicMaterial } from 'three';

const plane = ref()
const plane2 = ref()
const plane3 = ref()
const planes = useCorgiPlanes()

onMounted(() => {
  planes.addPlane(plane.value, new MeshBasicMaterial({ color: new Color("pink") }))
  planes.addPlane(plane2.value, new MeshBasicMaterial({ color: new Color("pink") }))
  planes.addPlane(plane3.value, new MeshBasicMaterial({ color: new Color("pink") }))
})

</script>

<style>
body,
:root {
  overscroll-behavior: none;
}
</style>

<style scoped>
:root {
  overscroll-behavior: none;
}

.Page {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  min-height: 200vh;
}

.Plane {
  flex: none;
  position: relative;
  width: 30%;
  aspect-ratio: 16/9;

  margin-top: 20px;

  background-color: yellow;

  backface-visibility: hidden;

  transform: translateZ(0);

  z-index: 0;
}
</style>
