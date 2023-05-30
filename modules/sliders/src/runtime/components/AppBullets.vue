<template>
  <div
    class="AppBullets"
  >
    <button
      v-for="(i, itemIndex) in length"
      :key="i"
      class="AppBullet"
      :class="{ '--selected': itemIndex === index }"
      :aria-label="`Bulletpoint-${itemIndex}`"
      @click="onClick(itemIndex)"
    />
  </div>
</template>

<script setup>

const BULLET_CLICK = 'bullet:click'
const emit = defineEmits(['bullet:click'])

defineProps({
  index: {
    type: Number,
    default: 0
  },
  length: {
    type: Number,
    default: 1
  }
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

  --background: #312451;
  --selected: #e2d7fd;
  --hover: #d6fdff;
}

.AppBullet {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  flex: none;
  width: 22px;
  aspect-ratio: 1;

  border: none;
  border-radius: 0;
  background-color: transparent;
  padding: 0;

  cursor: pointer;

  transition: 0.3s backgroundColor cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (hover: hover) and (pointer: fine) {
  .AppBullet:hover::before {

    background-color: var(--hover);
  }
}

.AppBullet::before {
  position: relative;
  width: 8px;
  aspect-ratio: 1;

  border-radius: 100%;

  background-color: var(--background);

  content: '';
}

.AppBullet.--selected {
  pointer-events: none;
}

.AppBullet.--selected::before {
  background-color: var(--selected);
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
