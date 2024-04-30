<template>
  <div class="Page">
    <div
      ref="component"
      class="Component"
    />
    <CorgiComponent
      v-if="plane"
      class="Component"
      :mesh="plane"
    />
    <CorgiComponent
      v-if="suzanne"
      class="Component"
      :mesh="suzanne"
    />
  </div>
</template>


<script setup>
import { AgXToneMapping, Color, DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, Uniform } from 'three'
import { RESOURCES_TYPES } from '../../../src/runtime/utils/types'
// import CustomShaderMaterial from 'three-custom-shader-material/vanilla' // Not working with reload, fixed by importing it in mounted O//
import { gsap } from 'gsap'
import { degToRad } from 'three/src/math/MathUtils.js'

const component = ref()
const components = useCorgiComponents()

const resources = useResources()

const plane = ref()
const suzanne = ref()

onMounted(async () => {

  const CustomShaderMaterial = (await import('three-custom-shader-material/vanilla')).default

  components.renderer.value.toneMapping = AgXToneMapping

  // TODO add gltf to components
  resources.add([
    useResource('envmap', '/envmap.exr', RESOURCES_TYPES.EXR),
    useResource('custom-vertex', import('@/assets/custom-shaders/vertex.glsl'), RESOURCES_TYPES.GLSL),
    useResource('texture', 'https://source.unsplash.com/random', RESOURCES_TYPES.IMAGE),
    useResource('suzanne', '/suzanne.glb', RESOURCES_TYPES.GLTF),
  ])

  resources.getAll().then(([envmap, vertexShader, texture, modelResource]) => {
    components.addEnvmap(envmap.asset)

    const geometry = new PlaneGeometry(1, 1, 10, 10)
    const material = new CustomShaderMaterial({
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
    plane.value = new Mesh(geometry, material)

    const material2 = new MeshStandardMaterial({ color: new Color("pink"), metalness: 0.9, roughness: 0.6, side: DoubleSide })
    const c = components.add(component.value, new Mesh(geometry, material2))
    gsap.to(c.mesh.rotation, { y: degToRad(360), duration: 5, ease: "none", repeat: -1 })

    suzanne.value = modelResource.asset.scene.getObjectByName("Suzanne")

    gsap.to(suzanne.value.rotation, { y: degToRad(360), duration: 5, ease: "none", repeat: -1 })
  })

})

onBeforeUnmount(() => {
  components.removeByElement(component.value)
})

// Methods
const update = (time) => {
  if (!plane.value) return
  plane.value.material.uniforms.uTime.value = time
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

  padding: 10vh 20px;
  gap: 120px;
}

.Component {
  flex: none;
  position: relative;
  width: 30%;
  aspect-ratio: 3/4;

  margin-top: 20px;

  /*background-color: yellow;*/

  backface-visibility: hidden;

  transform: translateZ(0);

  z-index: 0;
}
</style>
