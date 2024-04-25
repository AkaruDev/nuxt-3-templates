<template>
  <div class="Page">
    <div
      ref="plane"
      class="Plane"
    />
  </div>
</template>


<script setup>
import { Color, MeshBasicMaterial } from 'three';

const plane = ref()
const planes = useCorgiPlanes()

onMounted(() => {
  planes.addPlane(plane.value, new MeshBasicMaterial({ color: new Color("pink") }))
})

</script>

<style scoped>
.Page {
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
  width: 400px;
  height: 600px;

  margin-top: 20px;

  background-color: yellow;
}
</style>
