// eslint-disable-next-line no-unused-vars
import Resource from '../utils/Resource'

export const useResources = (() => {

  /**
   * resources
   * @type {Array<Resource>}
   */
  let resources = []

  /**
   * Add
   * @param {Resource | Array<Resource>} value
   */
  const add = (value) => {
    if (!Array.isArray(value)) {
      value = [value]
    }
    resources = [...value]
  }

  // TODO Add progress ref if needed for loading ux

  /**
   * Get asset and available load promise.
   * @param {String} name
   * @param {Function} done
   * @returns {Promise}
   */
  const get = (name, done = null) => {
    const item = resources.find(item => item?.name === name)
    // TODO if resource already loaded (file exist) returns it directly
    // TODO get promise with avalaible loader
    if (done) {
      // TODO Execute promise
      // TODO store file in resource.file
      done?.(item)
    }
    // TODO return promise
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
