<template>
  <div
    v-intersection-observer="onIntersectionObserver"
    class="AppImage"
    :style="{ aspectRatio: width / height }"
  >
    <div class="AppImage-container">
      <ClientOnly>
        <nuxt-picture
          v-if="placeholder === 'blur'"
          :modifiers="{ blur: 2000 }"
          :img-attrs="{ class: 'AppImage-image' }"
          :src="url"
          :alt="alt"
          :width="width * 0.1"
          :height="height * 0.1"
          quality="10"
          :loading="loading"
          :preload="preload"
          @load="onLoad"
        />
      </ClientOnly>
      <nuxt-picture
        v-if="isVisible"
        :img-attrs="{ class: 'AppImage-image' }"
        :src="url"
        :alt="alt"
        :width="width"
        :height="height"
        :quality="quality"
        :loading="loading"
        :preload="preload"
        :sizes="sizes"
        @load="onLoad"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { vIntersectionObserver } from '@vueuse/components'

defineProps({
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
  sizes: {
    type: String,
    default: "small:100vw medium:100vw large:100vw"
  },
  quality: {
    type: Number,
    default: 80,
    validator: value => value >= 0 && value <= 100
  }
})

const onLoad = (event) => {
  event?.target?.classList?.add("--loaded")
}

const isVisible = ref(false)

function onIntersectionObserver ([{ isIntersecting }]) {
  isVisible.value = isVisible.value || isIntersecting
}
</script>

<style scoped>
.AppImage {
  width: 100%;
}

.AppImage:deep(.AppImage-image) {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  opacity: 0;

  object-fit: cover;

  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);

}

.AppImage:deep(.AppImage-image.--loaded) {
  opacity: 1;
}

.AppImage-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
