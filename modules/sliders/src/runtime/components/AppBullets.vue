<template>
  <div
    class="AppBullets"
    :class="[...classes, { '--progress': hasProgress }]"
  >
    <button
      v-for="(i, itemIndex) in length"
      :key="i"
      class="AppBullet"
      :class="{ '--selected': itemIndex === index }"
      :aria-label="`Bullet-${itemIndex}`"
      @click="onClick(itemIndex)"
    >
      <AppCircle
        v-if="hasProgress"
        class="AppBullet-circle"
        :progress="itemIndex === index ? progress : 0"
        color="#FFA25F"
      />
    </button>
  </div>
</template>

<script setup>

const BULLET_CLICK = 'bullet:click'
const emit = defineEmits(['bullet:click'])

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  length: {
    type: Number,
    default: 1
  },
  hasProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  theme: {
    type: String,
    default: 'light',
    validator: value => ['dark', 'light'].includes(value)
  }
})

const classes = computed(() => {
  return ['--theme-' + props.theme]
})

const onClick = (index) => {
  emit(BULLET_CLICK, index)
}

</script>

<style scoped>
.AppBullets {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.AppBullets.--progress {
  gap: 5px;
}

.AppBullet {
  position: relative;
  box-sizing: border-box;
  flex: none;
  width: 8px;
  aspect-ratio: 1;

  margin: 0 6px;
  padding: 0;

  border-radius: 100%;

  background-color: #CCC;

  transition: 0.3s backgroundColor cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.AppBullet.--selected {
  pointer-events: none;
  background-color: #dbffb8;
}

.AppCircle.AppBullet-circle {
  position: absolute;
  width: 20px;
  height: 20px;

  top: 50%;
  left: 50%;

  z-index: 0;

  transform: translate3d(-50%, -50%, 0) rotate(-90deg);
}
</style>
