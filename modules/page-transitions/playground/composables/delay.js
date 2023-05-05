export const useDelay = (secondes) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, secondes * 1000)
  })
}
