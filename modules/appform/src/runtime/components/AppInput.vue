<template>
  <div
    ref="el"
    class="AppInput"
    :class="[`--type-${type}`]"
  >
    <label
      v-if="type !== 'hidden' && label"
      class="AppInput-label"
      :for="name"
    >
      <span v-html="label" />
      <span
        v-if="required"
        class="AppInput-required"
      >*</span>
    </label>

    <component
      :is="is"
      ref="input"
      :name="name"
      class="AppInput-element"
      :class="`--${type}`"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :value="value"
      @change="onChange"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: undefined
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'textarea', 'email', 'hidden'].includes(value)
  },
  required: {
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: undefined
  },
})

const el = ref()
const input = ref()

const is = computed(() => {
  return props.type === 'textarea' ? 'textarea' : 'input'
})


const onChange = () => {
  if (!props.required) return
  el.value?.classList?.remove('--valid')
  el.value?.classList?.remove('--error')

  if (input.value?.checkValidity()) {
    el.value?.classList?.add('--valid')
  } else {
    el.value?.classList?.add('--error')
  }
}

const reset = () => {
  el.value?.classList?.remove('--valid')
  el.value?.classList?.remove('--error')
}

defineExpose({ reset })
</script>

<style scoped>
.AppInput {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;

  gap: 12px;

  --valid-color: #A1BC90;
  --error-color: rgb(244, 101, 101);
  --highlight-color: white;
}


.AppInput.--valid .AppInput-required {
  color: var(--valid-color);
}

.AppInput.--error .AppInput-label {
  color: var(--error-color);
}

.AppInput.--error .AppInput-element {
  border-bottom-color: var(--error-color);
}

.AppInput-label {
  display: flex;

  gap: 0;
}

.AppInput-element {
  display: block;
  width: 100%;

  padding: 20px;

  border: none;
  outline: none;
  -webkit-appearance: none;
  border-radius: 13px;
  box-shadow: inset 0 0 0 1px #C5C5BF;
}

.AppInput-element.--textarea {
  height: 200px;
  resize: none;

}

.AppInput-element::placeholder {
  color: grey;
  opacity: 1;
}

.AppInput-element:focus {
  box-shadow: inset 0 0 0 2px var(--highlight-color);
}
</style>
