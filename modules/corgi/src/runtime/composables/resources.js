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
    resources = [...resources, ...value]
  }

  const setResource = (name) => {
    const resource = resources.find(item => item?.name === name)

    if (!resource) {
      console.error("No resource found with this name:", name)
      return
    }

    // Get promise with avalaible loader
    let loader = undefined

    switch (resource.type) {
      case RESOURCES_TYPES.GLTF:
        loader = gltfLoader.loadAsync(resource.path)
        break
      case RESOURCES_TYPES.EXR:
        loader = exrLoader.loadAsync(resource.path)
        break
      case RESOURCES_TYPES.IMAGE:
        loader = textureLoader.loadAsync(resource.path)
        break
      case RESOURCES_TYPES.GLSL:
        loader = resource.path
        break
    }

    if (!loader) {
      console.error("No loader found", resource)
      return
    }

    return new Promise((resolve) => {
      loader.then((result) => {
        resource.asset = result?.default || result
        resolve(resource)
      })
    })
  }

  /**
   *  Get assets by names in a promise.
   * @param {String[]} names
   * @returns {Promise} - Promise to be resolved with all the resource as an array
   */
  const getByNames = async (names = []) => {
    return Promise.all(resources.filter(resource => names.includes(resource.name)).map(resource => setResource(resource.name)))
  }

  /**
   * Get asset and available load promise.
   * @param {String | String[]} names - Name or array of names for the resource(s) to be found
   * @param {Function} done - Not mandatory method to retrieve the resource with the file inside
   * @returns {Promise} - Promise to be resolved with the resource
   */
  const get = (names) => {
    if (Array.isArray(names)) return getByNames(names)
    if (typeof names === "string") return setResource(names)
  }

  /**
   *  Get all the asset in a promise.
   * @returns {Promise} - Promise to be resolved with all the resource as an array
   */
  const getAll = async () => {
    return Promise.all(resources.map(resource => setResource(resource.name)))
  }

  const instance = {
    add,
    get,
    getAll,
  }

  return () => instance
})()
