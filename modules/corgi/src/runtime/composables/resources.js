export const useResources = ((manifest = []) => {

  let resources = [...manifest]

  const add = (toAdd = []) => {
    resources = [...toAdd]
  }

  const instance = {
    add,
    resources
  }

  return () => instance
})()
