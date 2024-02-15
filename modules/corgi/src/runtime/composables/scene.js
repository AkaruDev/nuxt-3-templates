import { Color, Scene } from "three"

export default function useScene (color = "#FCCF91") {

  const scene = new Scene()
  scene.background = new Color(color)

  return scene
}
