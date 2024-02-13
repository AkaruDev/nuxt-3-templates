<template>
  <div
    ref="el"
    v-intersection-observer="[onIntersectionObserver, { rootMargin: '0px 0px 200px 0px' }]"
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
        loading="eager"
        sizes="small:10vw"
        :modifiers="{ blur: 2000 }"
        :style="{ objectFit: fit }"
      />
      <nuxt-img
        v-show="isVisible"
        ref="img"
        :class="`AppImage-image --${loading}`"
        :src="url"
        :alt="alt"
        :width="width"
        :height="height"
        :quality="quality"
        :loading="loading"
        :preload="preload"
        :sizes="getSizes"
        :modifiers="modifiers"
        :fit="fit"
        :style="{ objectFit: fit }"
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
    default: 1440
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
    default: undefined
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
const img = ref()

const getSizes = computed(() => {
  const designWidth = 1440
  const size = (props.width / designWidth) * 100
  return props.sizes || `xs:100vw sm:100vw md:100vw lg:${size}vw xl:${size}vw xxl:${size}vw`
})

const onLoad = () => {
  el.value?.querySelector('.AppImage-image:not(.--loaded,.--placeholder)')?.classList?.add("--loaded")
}

const isVisible = ref(false)

onMounted(() => {
  // Fix img already loaded and does not emit load event
  if (img?.value?.$el?.complete) onLoad()
})

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

  transform: rotate(0.001deg);

  z-index: 0;

}

.AppImage:deep(.AppImage-image) {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;
}

.AppImage:deep(.AppImage-image.--lazy) {
  opacity: 0;
  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
}

.AppImage:deep(.AppImage-image.--placeholder) {
  opacity: 1;
  z-index: 0;
}

.AppImage:deep(.AppImage-image.--loaded.--lazy) {
  opacity: 1;
  transition: 0.3s opacity cubic-bezier(0.65, 0, 0.35, 1);
  z-index: 1;
}

.AppImage-container {
  position: relative;
  width: 100%;
  height: 100%;

}
</style>
