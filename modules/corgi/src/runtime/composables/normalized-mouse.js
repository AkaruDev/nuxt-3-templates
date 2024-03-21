import { Vector2 } from "three"
import { ref } from "vue"

/**
 *
 * @param {HTMLElement} element - Element used to normalized position to
 * @returns
 */
export const useNormalizedMouse = (element) => {
  const position = ref(new Vector2(0, 0))
  const normalized = ref(new Vector2(0, 0))

  /**
   * On mouse move
   * @param {MouseEvent} event
   */
  const onMouseMove = (event) => {
    position.value.x = event.clientX
    position.value.y = event.clientY
    normalized.value = normalizePosition(position.value, element)
  }

  const unmount = () => {
    window.removeEventListener("mousemove", onMouseMove)
  }

  window.addEventListener("mousemove", onMouseMove)

  return {
    position,
    normalized,
    unmount,
  }
}

/**
 *
 * @param {import('three').Vector2} position
 * @param {HTMLElement} element - Element used to normalized position to
 * @returns
 */
export const normalizePosition = (position, element) => {
  const bounds = element.getBoundingClientRect()
  let x = position.x - bounds.left
  x = x / bounds.width

  let y = position.y - bounds.top
  y = y / bounds.height
  y = 1 - y

  return new Vector2(x, y)
}
