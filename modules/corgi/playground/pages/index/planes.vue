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
import { Color, MeshStandardMaterial } from 'three';
import { RESOURCES_TYPES } from '../../../src/runtime/utils/types';
import { degToRad } from 'three/src/math/MathUtils.js';
import { gsap } from 'gsap'

const plane = ref()
const plane2 = ref()
const plane3 = ref()
const planes = useCorgiPlanes()

const resources = useResources()

onMounted(() => {

  resources.add([useResource('envmap', '/envmap.exr', RESOURCES_TYPES.EXR),])

  resources.get(['envmap']).then(([envmap]) => {
    planes.addEnvmap(envmap.asset)
    // gsap.to(planes.scene.environmentRotation, { x: degToRad(360), duration: 10, ease: "none", repeat: -1 })
  })

  planes.addPlane(plane.value, new MeshStandardMaterial({ color: new Color("pink"), metalness: 0.9, roughness: 0.2 }))
  planes.addPlane(plane2.value, new MeshStandardMaterial({ color: new Color("blue"), metalness: 0.9, roughness: 0.2 }))
  planes.addPlane(plane3.value, new MeshStandardMaterial({ color: new Color("red"), metalness: 0.9, roughness: 0.2 }))
})

onBeforeUnmount(() => {
  planes.removePlane(plane.value)
  planes.removePlane(plane2.value)
  planes.removePlane(plane3.value)
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
  aspect-ratio: 4/5;

  margin-top: 20px;

  background-color: yellow;

  backface-visibility: hidden;

  transform: translateZ(0);

  z-index: 0;
}
</style>
