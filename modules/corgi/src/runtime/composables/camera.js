import { PerspectiveCamera } from "three"

export default function useCamera () {
  const fov = 50
  const camera = new PerspectiveCamera(fov, 1, 0.1, 100)

  return camera
}
