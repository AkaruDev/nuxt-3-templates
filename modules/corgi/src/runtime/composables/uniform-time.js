import { Uniform } from "three"
import { useTicker } from "./ticker"

export const useUniformTime = () => {

  const uniform = new Uniform(0)

  const onTick = (time) => {
    uniform.value = time
  }
  useTicker(onTick)

  return uniform
}
