/**
 * Get child from gltf scene recursivly
 * @param {import('three').Object3D} object - Parent object to find child exemple: gltf.scene
 * @param {String} name - Name of the child to find
 * @returns {import('three').Mesh | undefined}
 */
export const getChild = (object, name) => {
  return object?.children?.find?.(child => {
    if (!child?.isMesh) return
    if (child?.name === name) return child

    if (child.children) return getChild(child, name)
  })
}

/**
 * Get material from gltf scene recursivly
 * @param {import('three').Object3D} object - Parent object to find material exemple: gltf.scene
 * @param {String} name - Name of the material to find
 * @returns {import('three').Mesh | undefined}
 */
export const getMaterial = (object, name) => {
  return object?.children?.map?.(child => {
    if (!child?.isMesh) return
    if (child?.material?.isMaterial && child.material.name === name) {
      return child.material
    } else {
      // an array of materials
      for (const material of child.material) {
        if (material?.isMaterial && material.name === name) {
          return material
        }
      }
    }
    if (child.children) return getMaterial(child, name)
  })?.[0] || undefined
}
