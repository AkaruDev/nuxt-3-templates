<template>
  <div
    ref="el"
    class="AppImage"
    :style="{ aspectRatio: width / height }"
  >
    <div
      class="AppImage-container"
      :style="backgroundStyles"
    >
      <nuxt-img
        v-if="url?.includes('prismic')"
        :key="`image-${width}`"
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
      <img
        v-else
        ref="img"
        :src="url"
        :width="width"
        :height="height"
        :loading="loading"
        :style="{ objectFit: fit }"
        @load="onLoad"
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

const $img = useImage()

const el = ref()
const img = ref()

const getSizes = computed(() => {
  const designWidth = 1440
  const size = Math.min(1.0, props.width / designWidth) * 100
  return props.sizes || `xs:100vw sm:100vw md:100vw lg:${size}vw xl:${size}vw xxl:${size}vw`
})

const onLoad = () => {
  el.value?.querySelector('.AppImage-image:not(.--loaded)')?.classList?.add("--loaded")
}

const placeHolderUrl = props?.placeholder === "blur" ?
  `url('${$img(
    props.url,
    {
      width: props.width,
      format: 'webp',
      // Prismic
      /*
      quality: 10,
      blur: 2000,
      */
      // Ipx
      quality: 100,
      blur: 100,
    }
  )}` : undefined

const backgroundStyles = ref({})

onMounted(() => {
  if (placeHolderUrl) backgroundStyles.value = { backgroundImage: placeHolderUrl, backgroundSize: props.fit }
  // Fix img already loaded and does not emit load event
  if (img?.value?.$el?.complete) onLoad()
})

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

  opacity: 0;
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
