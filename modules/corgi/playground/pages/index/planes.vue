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
import { AgXToneMapping, Color, DoubleSide, MeshStandardMaterial, Uniform } from 'three'
import { RESOURCES_TYPES } from '../../../src/runtime/utils/types'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { gsap } from 'gsap'
import { degToRad } from 'three/src/math/MathUtils.js';

const plane = ref()
const plane2 = ref()
const plane3 = ref()
const planes = useCorgiPlanes()

const resources = useResources()

let material = null

onMounted(() => {

  // TODO make component plane with rotation, position watch

  planes.renderer.value.toneMapping = AgXToneMapping

  resources.add([
    useResource('envmap', '/envmap.exr', RESOURCES_TYPES.EXR),
    useResource('custom-vertex', import('@/assets/custom-shaders/vertex.glsl'), RESOURCES_TYPES.GLSL),
    useResource('texture', 'https://source.unsplash.com/random', RESOURCES_TYPES.IMAGE),
  ])

  resources.getAll().then(([envmap, vertexShader, texture]) => {
    planes.addEnvmap(envmap.asset)

    material = new CustomShaderMaterial({
      baseMaterial: new MeshStandardMaterial({
        metalness: 0.9,
        roughness: 0.8,
        map: texture.asset,
      }),
      uniforms: {
        uTime: new Uniform(),
        uDepth: new Uniform(100),
      },
      vertexShader: vertexShader.asset,
      side: DoubleSide,
    })


    const p = planes.addPlane(plane.value, new MeshStandardMaterial({ color: new Color("pink"), metalness: 0.9, roughness: 0.6, side: DoubleSide }))
    planes.addPlane(plane2.value, new MeshStandardMaterial({ color: new Color("blue"), metalness: 0.9, roughness: 0.6, side: DoubleSide }))
    planes.addPlane(plane3.value, material, 128, 128)
    gsap.to(p.mesh.rotation, { y: degToRad(360), duration: 5, ease: "none", repeat: -1 })

  })

})

onBeforeUnmount(() => {
  planes.removePlane(plane.value)
  planes.removePlane(plane2.value)
  planes.removePlane(plane3.value)
})

// Methods
const update = (time) => {
  if (!material) return
  material.uniforms.uTime.value = time
}
useTicker(update)

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

  /*background-color: yellow;*/

  backface-visibility: hidden;

  transform: translateZ(0);

  z-index: 0;
}
</style>
