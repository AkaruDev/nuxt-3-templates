import { RESOURCES_TYPES } from '../utils/types'

/**
 * @typedef {Object} UseResource
 * @property {String} name - Asset name
 * @property {String} path - Path of the file to load
 * @property {String} type - Type of the file to find appropriate loader (exr, webp,webm,glb,gltf)
 * @property {*} file - File stored after loading
 */

/**
 * @property {String} name - Asset name
 * @property {String | Array<String>} path - Path of the file to load
 * @property {String} type - Extension of the file to find appropriate loader (exr, webp,webm,glb,gltf)
 * @property {String} file - Extension of the file to find appropriate loader (exr, webp,webm,glb,gltf)
 * @returns {UseResource}
 */
export const useResource = (name, path, type) => {
  if (!RESOURCES_TYPES?.[type]) {
    console.warn("Warning resource's type is not handled by the current loader", name, path, type)
  }

  return {
    name, path, type, file: undefined
  }
}
