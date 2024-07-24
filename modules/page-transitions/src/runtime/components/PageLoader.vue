<template>
  <div
    ref="el"
    class="PageLoader"
    :style="{
      '--progress': progress
    }"
    :class="{ '--show': isShown }"
  >
    <p>Welcome</p>
    <p>Progress</p>
    <p><span>{{ fulfilledPromises }} / {{ total }}</span></p>
    <p><span>{{ progress * 100 }}%</span></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePreloader } from '../composables/preloader'
import { useBusTransition } from '../composables/bus-transition'

const el = ref()
const isShown = ref(true)
const total = ref(1)

const progress = ref(0)
const fulfilledPromises = ref(0)

const preloader = usePreloader()
const busTransition = useBusTransition()
useTransition()

onMounted(async () => {
  preloader.preload(document.fonts.ready)

  total.value = preloader.promises.value.length

  await resolvePromises()
  hide()
})

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
  busTransition.onEnterDone()
  setTimeout(() => {
    preloader.reset()
  }, 300)
}

const preloadPromisesCallback = () => {
  fulfilledPromises.value++
  progress.value = fulfilledPromises.value / preloader.promises.value.length
}

</script>

<style>
.page-leave-active,
.page-enter-active {
  transition: 0.2s opacity ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.PageLoader {
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  top: 0;
  left: 0;

  gap: 10px;

  background-color: var(--primary, white);
  color: var(--secondary, black);

  z-index: 100;
  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
}

.PageLoader:not(.--show) {
  opacity: 0;
  pointer-events: none;
}

.PageLoader.--show {
  opacity: 1;
  pointer-events: auto;
}
</style>
