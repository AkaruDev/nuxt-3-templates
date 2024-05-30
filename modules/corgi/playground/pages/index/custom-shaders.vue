<template>
  <div class="Page">
    <canvas
      ref="canvas"
      class="Page-canvas"
    />
  </div>
</template>

<script setup>
import { RESOURCES_TYPES } from '../../src/runtime/utils/types'
import { AgXToneMapping, Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Uniform } from 'three'
// import CustomShaderMaterial from 'three-custom-shader-material/vanilla' // Not working with reload, fixed by importing it in mounted O//
import { useTicker } from '../../../src/runtime/composables/ticker'

// NOTE: You can do your own material if needed exemple in this gist https://gist.github.com/oskarbraten/8e4b4909de6525610055fc83add16b7b

// Data
const canvas = ref()

/**
 * @type {import('../../../src/runtime/composables/corgi').UseCorgi}
 */
const corgi = useCorgi(canvas)
let material = null
const resources = useResources()


// Lifecycle
onMounted(async () => {

  const CustomShaderMaterial = (await import('three-custom-shader-material/vanilla')).default

  corgi.camera.position.set(0, 0, 10)
  corgi.addOrbitControls()

  corgi.renderer.value.toneMapping = AgXToneMapping

  resources.add(
    [
      useResource('custom-fragment', import('@/assets/custom-shaders/fragment.glsl'), RESOURCES_TYPES.GLSL),
      useResource('custom-vertex', import('@/assets/custom-shaders/vertex.glsl'), RESOURCES_TYPES.GLSL),
    ]
  )

  resources.get(['custom-fragment', 'custom-vertex']).then((resources) => {
    const [fragmentShader, vertexShader] = resources
    const geometry = new PlaneGeometry(5, 5, 256, 256)
    material = new CustomShaderMaterial({
      baseMaterial: new MeshBasicMaterial({
        color: new Color("green"),
      }),
      uniforms: {
        uTime: new Uniform(),
        uDepth: new Uniform(0.5),
      },
      fragmentShader: fragmentShader.asset,
      vertexShader: vertexShader.asset,
      side: DoubleSide,
    })

    const plane = new Mesh(geometry, material)
    corgi.scene.add(plane)

  })

})

// Methods
const update = (time) => {
  if (!material) return
  material.uniforms.uTime.value = time
}
useTicker(update)
</script>

<style scoped>
.Page-canvas {
  position: absolute;
  width: 100% !important;
  height: 100% !important;

  top: 0;
  left: 0;

  z-index: 0;
}
</style>
