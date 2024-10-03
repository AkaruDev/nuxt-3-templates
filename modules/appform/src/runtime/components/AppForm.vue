<template>
  <div class="AppForm">
    <form
      v-show="state === STATES.default"
      ref="el"
      class="AppForm-element"
      :class="[`--state-${state}`]"
      autocomplete="false"
      :action="action"
      @submit.prevent="onSubmit"
    >
      <AppInput
        v-for="(item, i) in inputs"
        v-bind="item"
        :key="`input-${i}`"
        ref="inputsRef"
        class="AppForm-input AppText"
      />
      <button
        v-if="button"
        class="AppForm-button AppText"
        type="submit"
        aria-label="submit"
      >
        {{ button }}
      </button>
      <slot />
    </form>
    <div
      v-show="state === STATES.calling"
      class="AppForm-message AppText"
    >
      ...
    </div>
    <div
      v-show="state === STATES.success"
      class="AppForm-message AppText"
    >
      {{ success }}
      <button
        class="AppForm-button"
        type="button"
        aria-label="reset form"
        @click="onClickReset"
      >
        {{ reset }}
      </button>
    </div>
    <div
      v-show="state === STATES.error"
      class="AppForm-message AppText --error"
    >
      {{ errorMessage }}
      <button
        class="AppForm-button"
        type="button"
        aria-label="reset form"
        @click="onClickReset"
      >
        {{ reset }}
      </button>
    </div>
  </div>
</template>

<script setup>

// import { load } from 'recaptcha-v3'

const props = defineProps({
  action: {
    type: String,
    required: true
    // TODO validator for url format
  },
  inputs: {
    type: Array,
    default: () => { },
  },
  button: {
    type: String,
    default: undefined,
  },
  reset: {
    type: String,
    default: 'Reset',
  },
  success: {
    type: String,
    default: 'Thank you for your message. We will get back to you as soon as possible.',
  },
  error: {
    type: String,
    default: "We're sorry, but there was an error delivering your message. Please try again later.",
  }
})
const STATES = {
  default: 'default',
  calling: 'calling',
  success: 'success',
  error: 'error',
}
const el = ref()
const inputsRef = ref()
// const recaptcha = ref()
const config = useRuntimeConfig()
const state = ref(STATES.default)
const errorMessage = ref(props.error)

onMounted(async () => {
  /*
  recaptcha.value = await load(config.public.recaptcha, {
    autoHideBadge: true
  })
    */
  resetForm()
})

const onSubmit = async () => {
  // if (!recaptcha.value) return
  if (!el.value?.reportValidity()) return

  state.value = STATES.calling

  // Call api
  try {
    const formData = new FormData(el.value)

    /*
    const token = await recaptcha.value.execute()
    formData.append('token', token)
    */

    const baseUrl = config.public.baseUrl ? config.public.baseUrl : ''
    const url = `${baseUrl}${props.action}`

    const options = {
      method: 'POST',
      body: formData
    }
    fetch(url, options).then(async (response) => {
      console.info(response)
      const result = await response?.json() || {}
      errorMessage.value = result?.message || props.error

      if (response.status === 200) {
        state.value = STATES.success
      } else {
        state.value = STATES.error
        console.warn(result)
      }
    }).catch(error => {
      state.value = STATES.error
      console.warn(error)
    })
  } catch (error) {
    state.value = STATES.error
    console.warn(error)
  }
}

const onClickReset = () => {
  resetForm()
}

const resetForm = () => {
  el.value?.reset()
  inputsRef.value?.forEach(input => {
    input?.reset()
  })
  state.value = STATES.default
}

</script>

<style lscoped>
.AppForm {
  position: relative;
}

.AppForm-element {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem 6rem;

}

.AppForm-input {
  width: 100%;
}

.AppForm-message {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50rem;

  gap: 3rem;
}

.AppForm-button {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 40px;

  padding: 10px 20px;
  border: none;
  border-radius: 13px;

  background-color: white;
}
</style>
