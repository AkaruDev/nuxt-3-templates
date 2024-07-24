<template>
  <div
    ref="el"
    class="PageTransition"
    :class="{ '--show': isShown }"
    :style="{
      '--progress': progress
    }"
  >
    <p>Welcome</p>
    <p>Progress</p>
    <p><span>{{ fulfilledPromises }} / {{ total }}</span></p>
    <p><span>{{ progress * 100 }}%</span></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePreloader } from '../composables/preloader'
import { useBusTransition } from '../composables/bus-transition'

const el = ref()
const isShown = ref(false)
const total = ref(1)

const progress = ref(0)
const fulfilledPromises = ref(0)

const preloader = usePreloader()
const busTransition = useBusTransition()

const { $viewportObserver } = useNuxtApp()

const onEnter = async ({ el, done, from, to }) => {
  await resolvePromises()
  hide({ el, done, from, to })
}
busTransition.on('transition:enter', onEnter)

const onLeave = async ({ el, done, from, to }) => {
  total.value = preloader.promises.value.length
  show({ el, done, from, to })
}
busTransition.on('transition:leave', onLeave)


const resolvePromises = async () => {
  await Promise.allSettled([
    ...preloader.promises.value.map(async p => {
      try {
        return await p.then()
      }
      catch (e) {
        console.warn(e)
      } finally {
        preloadPromisesCallback()
      }
    })
  ])
}

const hide = () => {
  isShown.value = false
  if ($viewportObserver?.active?.value) $viewportObserver.active.value = true
  setTimeout(() => {
    fulfilledPromises.value = 0
    progress.value = 0
    busTransition.onEnterDone()
    preloader.reset()
  }, 300)
}

const show = () => {
  isShown.value = true
  if ($viewportObserver?.active?.value) $viewportObserver.active.value = false
  busTransition.onLeaveDone()
  setTimeout(() => {
    busTransition.onLeaveDone()
  }, 300)
}

const preloadPromisesCallback = () => {
  fulfilledPromises.value++
  progress.value = fulfilledPromises.value / total.value
}

</script>

<style scoped>
.PageTransition {
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  top: 0;
  left: 0;

  overflow: hidden;

  gap: 20px;

  background-color: var(--primary, white);
  color: var(--secondary, black);

  z-index: 100;

  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
}

.PageTransition:not(.--show) {
  opacity: 0;
  pointer-events: none;
}

.PageTransition.--show {
  opacity: 1;
  pointer-events: auto;
}
</style>
