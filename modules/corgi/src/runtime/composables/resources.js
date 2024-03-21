import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { RESOURCES_TYPES } from '../utils/types'
import { TextureLoader } from 'three'

export const useResources = (() => {

  // Set loaders
  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')
  dracoLoader.preload()
  gltfLoader.setDRACOLoader(dracoLoader)
  const exrLoader = new EXRLoader()
  const textureLoader = new TextureLoader()

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
    if (resource.type === RESOURCES_TYPES.EXR) {
      loader = exrLoader.loadAsync(resource.path)
    }
    if (resource.type === RESOURCES_TYPES.IMAGE) {
      loader = textureLoader.loadAsync(resource.path)
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
  /**
   *  Get all the asset in a promise.
   * @returns {Promise} - Promise to be resolved with all the resource as an array
   */
  const getAll = async () => {
    return Promise.all(resources.map(resource => get(resource.name)))
  }

  const instance = {
    add,
    get,
    getAll,
  }

  return () => instance
})()
