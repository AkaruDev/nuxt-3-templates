import { Vector2 } from "three"
import { ref, onMounted, onUnmounted } from "vue"

/**
 *
 * @param {ref<HTMLElement>} element - Element used to normalized position to
 * @returns
 */
export const useNormalizedMouse = (element) => {
  const lastPosition = new Vector2(0, 0)
  const position = ref(new Vector2(0, 0))
  const normalized = ref(new Vector2(0, 0))
  const velocity = ref(new Vector2(0, 0))
  let lastTime = 0

  /**
   * On mouse move
   * @param {MouseEvent} event
   */
  const onMouseMove = (event) => {
    if (!element?.value) return
    position.value.x = event.clientX
    position.value.y = event.clientY
    normalized.value = normalizePosition(position.value, element.value)


    const deltaX = event.clientX - lastPosition.x
    const deltaY = event.clientY - lastPosition.y
    let time = performance.now()

    let delta = Math.max(14, time - lastTime)

    velocity.value.x = deltaX / delta
    velocity.value.y = deltaY / delta

    lastTime = time
    lastPosition.set(event.clientX, event.clientY)
  }

  onMounted(() => {
    window.addEventListener("mousemove", onMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener("mousemove", onMouseMove)
  })

  return {
    position,
    normalized,
    velocity,
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
