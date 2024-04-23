<template>
  <div class="Page">
    <CorgiCanvas
      class="Page-canvas"
      envmap="/envmap.exr"
      model="/suzanne.glb"
      :camera-position="cameraPosition"
      :model-rotation="modelRotation"
      :orbit-controls="true"
      :enable-zoom="true"
      :enable-pan="false"
      :show-envmap="false"
    />
    <!-- :background-color="new Color('pink')" -->
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { Vector3 } from 'three'
import { degToRad } from 'three/src/math/MathUtils.js';


const cameraPosition = ref(new Vector3(0, 0, 6))
const modelRotation = ref(new Vector3(0, 0, 0))

onMounted(() => {
  gsap.to(cameraPosition.value, { x: 0, y: 0, z: 4, duration: 0.8, ease: "power3.out" })
  gsap.to(modelRotation.value, { y: degToRad(360), duration: 5, ease: "none", repeat: -1 })
})

</script>

<style  scoped>
.Page {
  background-color: #1a1a1a;
}

.Page-canvas {
  position: absolute;
  width: 50vw;
  height: 50vh;

  top: 50%;
  left: 50%;

  transform: translate3d(-50%, -50%, 0);

  z-index: 0;
}
</style>
