<template>
  <div
    ref="el"
    v-intersection-observer="[onIntersectionObserver]"
    class="AppImage"
    :style="{ aspectRatio: width / height }"
  >
    <div class="AppImage-container">
      <nuxt-img
        v-if="placeholder === 'blur'"
        :class="`AppImage-image --placeholder --${loading}`"
        :src="url"
        :alt="alt"
        :quality="10"
        :fit="fit"
        :width="width"
        :height="height"
        :loading="loading"
        :sizes="sizes"
        :modifiers="{ blur: 80 }"
      />
      <nuxt-img
        v-show="isVisible"
        :class="`AppImage-image --${loading}`"
        :src="url"
        :alt="alt"
        :width="width"
        :height="height"
        :quality="quality"
        :loading="loading"
        :preload="preload"
        :sizes="sizes"
        :modifiers="modifiers"
        :fit="fit"
        @load="onLoad"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { vIntersectionObserver } from '@vueuse/components'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: undefined
  },
  preload: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: undefined
  },
  height: {
    type: Number,
    default: undefined
  },
  loading: {
    type: String,
    default: "lazy",
    validator: value => ['lazy', 'eager'].includes(value)
  },
  placeholder: {
    type: String,
    default: "blur",
    validator: value => ['none', 'blur'].includes(value)
  },
  fit: {
    type: String,
    default: "cover",
    validator: value => ['cover', 'contain', 'fill', 'none'].includes(value)
  },
  sizes: {
    type: String,
    default: "small:100vw medium:100vw large:66vw"
  },
  quality: {
    type: Number,
    default: 80,
    validator: value => value >= 0 && value <= 100
  },
  modifiers: {
    type: Object,
    default: undefined,
  },
})

const el = ref()

const onLoad = () => {
  el.value?.querySelector('.AppImage-image:not(.--loaded,.--placeholder)')?.classList?.add("--loaded")
}

const isVisible = ref(false)

const onIntersectionObserver = ([{ isIntersecting }]) => {
  if (isIntersecting && !isVisible.value) {
    isVisible.value = true
  }
}

</script>

<style scoped>
.AppImage {
  position: relative;
  width: 100%;

  user-select: none;
}

.AppImage:deep(.AppImage-image) {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  object-fit: v-bind('props.fit');
}

.AppImage:deep(.AppImage-image.--lazy) {
  opacity: 0;
  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
}

.AppImage:deep(.AppImage-image.--placeholder) {
  opacity: 1;
}

.AppImage:deep(.AppImage-image.--loaded.--lazy) {
  opacity: 1;
  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
}

.AppImage-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
