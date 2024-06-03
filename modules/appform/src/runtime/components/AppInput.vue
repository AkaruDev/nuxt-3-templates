<template>
  <div
    ref="el"
    class="AppInput"
  >
    <label
      v-if="type !== 'hidden' && label"
      class="AppInput-label"
    >{{ label }}<span v-if="required"> *</span></label>
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
    validator: (value) => ['text', 'textarea', 'hidden'].includes(value)
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
  console.info("cc")
  el.value?.classList?.remove('--valid')
  el.value?.classList?.remove('--error')

  if (input.value?.checkValidity()) {
    el.value?.classList?.add('--valid')
  } else {
    el.value?.classList?.add('--error')
  }
}

</script>

<style  scoped>
.AppInput {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;

  gap: 10px;

  --valid-color: rgb(106, 220, 106);
  --error-color: rgb(244, 101, 101);
  --highlight-color: rgb(255, 180, 42);
}


.AppInput.--valid .AppInput-label {
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

  gap: 8px;

  font-style: normal;
  font-weight: 500;
  font-size: 16px;
}

.AppInput-element {
  display: block;
  width: 100%;

  padding: 10px 10px;

  border: none;
  outline: none;
  box-shadow: inset 0 0 0 2px rgba(255, 252, 248, 0.2);
}

.AppInput-element.--textarea {
  min-height: 150px;
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
