import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { gsap } from 'gsap'
import { clamp } from '../utils/math'
import { useBus } from './bus'
// import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from '@studio-freight/lenis'

export const useSmoothScroll = (() => {

  // Variables
  /**
   * @type {Element}
   */
  let container = ref(null)
  let directions = {
    up: 'up',
    down: 'down'
  }
  const y = {
    previous: 0,
    lerp: 0,
    value: 0,
    direction: directions.down
  }
  /**
   * @type {RefImpl<Number>}
   */
  let bounds = ref(0)
  let lenis = null

  /**
   * @type {RefImpl<Boolean>}
   */
  const active = ref(true)
  /**
   * @type {RefImpl<Boolean>}
   */
  const isLocked = ref(false)
  let resizeObserver = null

  // Set bus
  const { bus, on, off } = useBus()

  const init = () => {
    const inBrowser = typeof window !== 'undefined'

    if (inBrowser) {
      // active.value = window.matchMedia("(pointer:fine)").matches
      // active.value = false

      if (active.value) {
        lenis = new Lenis({
          autoResize: false,
          lerp: 0.07,
          wheelMultiplier: 1,
        })
        gsap.ticker.add(onTick)
        gsap.ticker.lagSmoothing(0)
      } else {
        window.addEventListener('scroll', onScroll)
      }
    }
  }

  /**
   * Start/se the virtual scroll
   * @param {Element} el
   */
  const start = (el) => {
    container.value = el
    setBounds()
    resizeObserver = useResizeObserver(container.value, onResize)
    onResize()
  }

  const onScroll = () => {
    setY()
    setDirection()
    bus.emit('scroll', y)
  }

  const onTick = (time) => {
    if (isLocked.value) {
      bus.emit('scroll', y)
      return
    }
    lenis.raf(time * 1000)
    setY()
    setDirection()
    bus.emit('scroll', y)
  }

  const setY = () => {
    if (active.value && lenis) {
      y.lerp = lenis.animatedScroll
      y.value = lenis.actualScroll
      y.target = lenis.targetScroll
    } else {
      y.lerp = window.scrollY
      y.value = window.scrollY
      y.target = window.scrollY
    }
  }

  const setDirection = () => {
    if (y.previous > y.value) {
      y.direction = directions.up
    } else if (y.previous < y.value) {
      y.direction = directions.down
    }

    y.previous = y.value
  }

  const scrollOf = (value = 0, force = false) => {
    if (isLocked.value && !force) return

    y.value = clamp(y.value + value, 0, bounds.value)
    lenis?.scrollTo(y.value)
  }

  /**
   *
   * @param {Number} yValue
   * @param {Boolean} force bypass isLock
   * @returns
   */
  const scrollTo = (yValue, force = false) => {
    if (isLocked.value && !force) return

    if (!active.value) {
      window.scrollTo(0, yValue, {
        behavior: 'smooth'
      })
    } else {
      scrollOf(yValue - y.value)
    }
  }

  const onResize = () => {
    // active.value = window.matchMedia("(pointer:fine)").matches
    // setTimeout(()=>{
    if (active.value) {
      lenis.resize()
    }

    setY()

    bus.emit('scroll', y)
    bus.emit('resize')
    setBounds()
    // }, 0)
  }

  const setBounds = () => {
    if (!active.value || !container.value) return

    bounds.value = Math.abs(container.value.clientHeight - window.innerHeight)
  }

  /**
   * Go to scroll y value
   * @param {Number} yValue
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const goTo = (yValue, force = false) => {
    if (isLocked.value && !force) return

    if (!active.value) {
      window.scrollTo(0, yValue)
      onScroll()
    } else {
      lenis.scrollTo(yValue, { immediate: true, force: force, lock: force })
      setY()
    }
  }

  /**
   * Scroll of one viewport/window height
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const scrollOfOneViewport = (force = false) => {
    if (isLocked.value && !force) return

    scrollTo(y.value + window.innerHeight)
  }

  /**
   * Scroll to top
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  // const scrollToTop = (force = false) => {
  //   if (isLocked.value && !force) return

  //   scrollTo(0, force)
  // }

  /**
   *  Go to element top
   * @param {HTMLElement} element
   * @param {Number} offset
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const goToElement = (element, offset = 0, force = false) => {
    if (isLocked.value && !force) return
    if (!element || !element.getBoundingClientRect) return
    const yValue = y.lerp + element.getBoundingClientRect().top + offset
    goTo(yValue, force)
  }

  /**
   *  Go to top
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const goToTop = (force = false) => {
    if (isLocked.value && !force) return

    goTo(0, force)
  }

  /**
   * Scroll to bottom
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const scrollToBottom = (force = false) => {
    if (isLocked.value && !force) return

    scrollTo(bounds.value, force)
  }


  /**
   * Go to bottom
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const goToBottom = (force = false) => {
    if (isLocked.value && !force) return

    goTo(bounds.value, force)
  }

  /**
   * Scroll to element top
   * @param {Element} element
   * @param {Number} offset
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const scrollToElement = (element = null, offset = 0, force = false) => {
    if (isLocked.value && !force) return
    if (!element || !element.getBoundingClientRect) return

    const yValue = y.lerp + element.getBoundingClientRect().top + offset
    scrollTo(yValue, force)
  }

  /**
   * Ease scroll to element top
   * @param {Element} element
   * @param {Number} offset
   * @param {Boolean} force bypass isLocked
   * @param {Number} duration
   * @param {Function} done called on scroll end
   * @returns
   */
  const easeToElement = (element = null, offset = 0, force = false, duration = 0.6, done = null) => {
    gsap.killTweensOf(y)
    if (isLocked.value && !force) return
    if (!element || !element.getBoundingClientRect) return

    const yValue = y.lerp + element.getBoundingClientRect().top + offset
    gsap.to(y, {
      value: yValue, duration, ease: "power3.out", onUpdate: () => {
        scrollTo(y.value, force)
      }, onComplete: () => {
        done?.()
      }
    })
  }

  const destroy = () => {
    gsap.ticker.remove(onTick)
    lenis?.destroy()
    resizeObserver?.disconnect()
    // window.removeEventListener('keydown', onKeyDown)
  }

  /**
   * Lock current scroll position
   */
  const lock = () => {
    isLocked.value = true

    if (active.value) {
      lenis.stop()
    } else {
      document.body.style.overflow = 'hidden'
    }


  }

  /**
   * Unlock current scroll position
   */
  const unlock = () => {
    isLocked.value = false
    if (active.value) {
      lenis.start()
    } else {
      document.body.style.overflow = 'auto'
    }

  }


  const instance = {
    on,
    off,
    container,
    active,
    y,
    directions,
    bounds,
    scrollTo,
    scrollOfOneViewport,
    scrollToElement,
    scrollToBottom,
    easeToElement,
    goToElement,
    goToTop,
    goToBottom,
    goTo,
    isLocked,
    lock,
    unlock,
    destroy,
    start,
    init,
    onResize
  }

  return () => instance
})()
