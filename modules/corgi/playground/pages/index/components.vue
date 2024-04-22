<template>
  <div class="Page">
    <CorgiCanvas
      class="Page-canvas"
      envmap="/envmap.exr"
      gltf="/suzanne.glb"
      :camera-position="new Vector3(0, 0, 3)"
      :orbit-controls="true"
      :enable-zoom="false"
      :enable-pan="false"
      :show-envmap="false"
      :background-color="new Color('pink')"
    />
  </div>
</template>

<script setup>
import { Color, Vector3 } from 'three';

</script>

<style scoped>
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
