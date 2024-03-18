import { RESOURCES_TYPES } from './types'

/**
 * @typedef {Object} Resource
 * @property {String} name - Asset name
 * @property {String} path - Path of the file to load
 * @property {String} type - Type of the file to find appropriate loader (exr, webp,webm,glb,gltf)
 */

/**
 * @property {String} name - Asset name
 * @property {String | Array<String>} path - Path of the file to load
 * @property {String} type - Extension of the file to find appropriate loader (exr, webp,webm,glb,gltf)
 */
export default class Resource {
  constructor(name, path, type) {
    if (!RESOURCES_TYPES?.[type]) {
      console.warn("Warning resource's type is not handled by the current loader", name, path, type)
    }
    this.name = name
    this.path = path
    this.type = type
    this.file = undefined
  }
}
