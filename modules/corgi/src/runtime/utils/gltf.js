/**
 * Get child from gltf scene recursivly
 * @param {import('three').Object3D} object - Parent object to find child exemple: gltf.scene
 * @param {String} name - Name of the child to find
 * @returns {import('three').Object3D | undefined}
 */
export const getChild = (object, name) => {
  const child = object?.children?.find?.(child => {
    if (child?.name === name) return child

    if (child.children) return getChild(child, name)
  })

  return child
}


// TODO get material
// TODO get camera
