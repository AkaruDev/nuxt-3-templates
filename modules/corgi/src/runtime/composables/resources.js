import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RESOURCES_TYPES } from '../utils/types'

export const useResources = (() => {

  // Set loaders
  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')
  dracoLoader.preload()
  gltfLoader.setDRACOLoader(dracoLoader)

  /**
   * resources
   * @type {Array<import("./resource").UseResource>}
   */
  let resources = []

  /**
   * Add
   * @param {import("./resource").UseResource | Array<import("./resource").UseResource>} value
   */
  const add = (value) => {
    if (!Array.isArray(value)) {
      value = [value]
    }
    resources = [...value]
  }

  /**
   * Get asset and available load promise.
   * @param {String} name - Name of the resource to be found
   * @param {Function} done - Not mandatory method to retrieve the resource with the file inside
   * @returns {Promise} - Promise to be resolved with the resource
   */
  const get = async (name) => {
    const resource = resources.find(item => item?.name === name)

    if (!resource) {
      console.error("No resource found with this name:", name)
      return
    }

    // Get promise with avalaible loader
    let loader = undefined
    if (resource.type === RESOURCES_TYPES.GLTF) {
      loader = gltfLoader.loadAsync(resource.path)
    }

    if (!loader) {
      console.error("No loader found", resource)
      return
    }

    return new Promise((resolve) => {
      loader.then((result) => {
        resource.asset = result
        resolve(resource)
      })
    })
  }

  // TODO method get resources, that load the resource with appropriate loader
  // TODO method get all and done callback

  const instance = {
    add,
    get,
    resources
  }

  return () => instance
})()
