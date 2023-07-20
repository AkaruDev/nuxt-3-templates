import { useAppConfig } from '#app'
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { getGPUTier } from 'detect-gpu';

export const useDevice = () => {

  const config = useAppConfig()

  const breakpoints = config?.breakpoints || {
    small: 768,
    medium: 1080,
    large: 1440,
    xlarge: 1660,
    xxlarge: 1920,
    xxxlarge: 2560,
  }

  const { width, height } = useWindowSize()

  // Breakpoints
  const mobile = ref(false)
  const tablet = ref(false)
  const desktop = ref(false)

  // Screen orientation
  const landscape = ref(true)
  const portrait = ref(false)

  // Virtualkeyboard
  let previousWidth = ref(0)
  let previousHeight = ref(0)
  const virtualKeyboardIsOpen = ref(false)

  // Pointers
  const mouse = ref(true)
  const touch = ref(true)

  // Browser
  const safari = ref(false)

  // Device power
  const getGpuTier = async () => {
    const gpu = await getGPUTier()

    return gpu?.tier
  }

  function update () {

    // Breakpoints
    mobile.value = width.value <= breakpoints.small
    tablet.value = width.value > breakpoints.small && width.value <= breakpoints.medium
    desktop.value = width.value > breakpoints.medium

    const widthChanged = previousWidth.value !== width.value
    const heightChanged = previousHeight.value !== height.value
    virtualKeyboardIsOpen.value = mobile.value && heightChanged && !widthChanged

    // Screen orientation
    landscape.value = width.value > height.value
    portrait.value = width.value <= height.value

    // Pointers
    mouse.value = window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches || false
    touch.value = window.matchMedia?.('(hover: none) and (pointer: coarse)')?.matches || false

    // Browser
    const isChrome = navigator.userAgent.indexOf("Chrome") > -1
    const isSafari = navigator.userAgent.indexOf("Safari") > -1
    safari.value = !isChrome && isSafari

    previousWidth.value = width.value
    previousHeight.value = height.value
  }

  onMounted(() => {
    window.addEventListener('resize', update)
    update()
  })
  onUnmounted(() => window.removeEventListener('resize', update))

  return { mobile, tablet, desktop, landscape, portrait, mouse, touch, safari, getGpuTier, virtualKeyboardIsOpen }
}
