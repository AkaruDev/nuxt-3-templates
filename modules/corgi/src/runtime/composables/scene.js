import { Color, Scene } from "three"

export const useScene = (color = "#FCCF91") => {

  const scene = new Scene()
  scene.background = new Color(color)

  /**
   * Frees the GPU-related resources allocated by this instance, mesh, textures etcs.
   */
  const dispose = () => {
    scene?.traverse((object) => {
      if (!object.isMesh) { return }
      object?.geometry?.dispose()

      if (object?.material?.isMaterial) {
        cleanMaterial(object.material)
      } else {
        // an array of materials
        for (const material of object.material) { cleanMaterial(material) }
      }
    })
  }

  const cleanMaterial = (material) => {
    material.dispose()

    // dispose textures
    for (const key of Object.keys(material)) {
      const value = material[key]
      if (value && typeof value === 'object' && 'minFilter' in value) {
        value?.dispose()
      }
    }
  }

  return { scene, dispose }
}
