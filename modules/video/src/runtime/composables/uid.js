let uid = 0

export const useUID = () => {
  uid++
  return uid
}
