<template>
  <div class="Page">
    <CorgiCanvas
      class="Page-canvas"
      envmap="/envmap.exr"
      model="/suzanne.glb"
      :camera-position="position"
      :camera-rotation="rotation"
      :orbit-controls="true"
      :enable-zoom="true"
      :enable-pan="false"
      :show-envmap="false"
      :background-color="new Color('pink')"
    />
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { Color, Vector3 } from 'three'


const position = ref(new Vector3(0, 0, 3))
const rotation = ref(new Vector3(0, 0, 0))

onMounted(() => {
  gsap.to(position.value, { x: 0.1, y: -0.1, z: 6, duration: 2, ease: "power3.out" })
  gsap.to(rotation.value, { x: 0.1, y: 0.1, z: 10.5, duration: 2, ease: "power3.out" })
  // position.value.y = 1.5
})

</script>

<style  scoped>
.Page {
  background-color: #1a1a1a;
}

.Page-canvas {
  position: absolute;
  width: 35vw;
  height: 25vw;

  top: 50%;
  left: 50%;

  transform: translate3d(-50%, -50%, 0);

  z-index: 0;
}
</style>
