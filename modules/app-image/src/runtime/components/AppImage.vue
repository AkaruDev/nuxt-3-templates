<template>
  <div
    ref="el"
    v-intersection-observer="[onIntersectionObserver]"
    class="AppImage"
    :style="{ aspectRatio: width / height }"
  >
    <div class="AppImage-container">
      <nuxt-picture
        v-if="placeholder === 'blur'"
        :img-attrs="{ class: 'AppImage-image --placeholder' }"
        :src="url"
        :alt="alt"
        :width="width * 0.1"
        :height="height * 0.1"
        quality="10"
        fit="cover"
        :loading="loading"
        :sizes="`small:100vw medium:${width / 1440}vw`"
      />
      <nuxt-picture
        v-show="isVisible"
        :img-attrs="{ class: 'AppImage-image' }"
        :src="url"
        :alt="alt"
        :width="width"
        :height="height"
        :quality="quality"
        :loading="loading"
        :preload="preload"
        :sizes="sizes"
        :modifiers="modifiers"
        fit="cover"
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
    default: "small:100vw medium:100vw large:100vw"
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
  el.value?.querySelector('.AppImage-image:not(.--loaded,.--placeholder)').classList?.add("--loaded")
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

  opacity: 0;

  object-fit: v-bind('props.fit');

  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
}

.AppImage:deep(.AppImage-image.--placeholder),
.AppImage:deep(.AppImage-image.--loaded) {
  opacity: 1;
}

.AppImage-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
