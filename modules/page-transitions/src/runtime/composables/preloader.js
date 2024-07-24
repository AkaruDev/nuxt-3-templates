import { ref } from "vue"

export const usePreloader = (() => {

  let promises = ref([])

  /**
   *
   * @param {Promise} promise
   */
  const preload = (promise) => {
    if (typeof promise?.then === 'function') {
      promises.value.push(promise)
    }
  }

  const reset = () => {
    promises.value = []
  }

  const instance = {
    preload,
    reset,
    promises
  }

  return () => instance
})()
