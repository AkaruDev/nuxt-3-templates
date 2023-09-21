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
import { useBusTransition } from '../composables/bus-transition';
import { useTransition } from '../composables/transition';

const el = ref()
const isShown = ref(false)
const total = ref(1)

const progress = ref(0)
const fulfilledPromises = ref(0)

const { preloader, busTransition } = useTransition()

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
  const { preloader } = useTransition()
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

const hide = ({ done }) => {// { to, from, promises = [], done } = {}
  document.body.classList.remove('cursor-loading')
  isShown.value = false
  $viewportObserver.active.value = true
  busTransition.onEnterDone()
  setTimeout(() => {
    preloader.reset()
    fulfilledPromises.value = 0
    progress.value = 0
    done()
  }, 300)
}

const show = ({ done }) => {
  document.body.classList.add('cursor-loading')
  isShown.value = true
  $viewportObserver.active.value = false
  busTransition.onLeaveDone()
  setTimeout(() => {
    done()
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
