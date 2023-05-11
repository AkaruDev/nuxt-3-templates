<template>
  <AppLink
    :tag="tag"
    :title="title"
    :type="type"
    :to="to"
    :force-reload="forceReload"
    :open-in-new-tab="openInNewTab"
    class="AppButton"
  >
    <!-- Icon -->
    <AppSvg
      v-if="icon"
      :name="icon"
      class="AppButton-svg"
    />

    <!-- Label -->
    <span
      v-if="label"
      class="AppButton-label"
    >{{ label }}</span>
  </AppLink>
</template>

<script setup>
import AppLink from './AppLink.vue';
defineProps({
  ...AppLink.props,
  label: {
    type: String,
    required: false,
    default: null
  },
  icon: {
    type: String,
    required: false,
    default: null
  }
});
</script>

<style  scoped>
.AppButton {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 10px 15px;

  gap: 15px;

  border-radius: 13px;
  border: 1px solid #131313;

  background-color: white;
  color: #131313;

  text-decoration: none;
}

.AppButton-svg {
  display: block;
  width: 30px;
  fill: #131313;
}
</style>
