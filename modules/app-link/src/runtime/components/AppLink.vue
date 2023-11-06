<template>
  <Component
    :is="getComponentTag()"
    class="AppLink"
    v-bind="getComponentAttributes()"
  >
    <slot />
  </Component>
</template>

<script setup>

const props = defineProps({
  tag: {
    type: String,
    required: false,
    default: null
  },
  title: {
    type: String,
    required: false,
    default: null
  },
  type: {
    type: String,
    required: false,
    default: null,
    validator: value =>
      [null, 'email', 'tel', 'place'].includes(value)
  },
  to: {
    type: [String, Object],
    required: false,
    default: null
  },
  forceReload: {
    type: Boolean,
    required: false,
    default: false
  },
  openInNewTab: {
    type: Boolean,
    required: false,
    default: false
  },
  trailingSlash: {
    type: Boolean,
    required: false,
    default: true
  }
})

const router = useRouter()
const TYPES = ['email', 'tel', 'place']

let AppPrismicLink = null
try {
  AppPrismicLink = resolveComponent('PrismicLink')
} catch (e) {
  // Prismic is not installed
}
const AppNuxtLink = resolveComponent('NuxtLink')

const getComponentTag = () => {
  if (props.tag) return props.tag

  if (!props.to) return 'div'

  if (typeof props.to === 'string') return 'a'

  if ('link_type' in props.to) {
    if (props.forceReload || props.openInNewTab) {
      return 'a'
    }

    return AppPrismicLink || 'a'
  }

  if ('path' in props.to || 'name' in props.to) {
    if (props.forceReload) return 'a'

    return AppNuxtLink
  }

  return 'button'

}

const getComponentAttributes = () => {
  const attributes = {}

  if (props.type === 'submit') {
    attributes.type = 'submit'
  }

  if (props.tag || !props.to) return attributes

  if (typeof props.to === 'string') {
    if (TYPES.includes(props.type)) {
      if (props.type === 'email') attributes.href = `mailto:${props.to}`
      if (props.type === 'tel') attributes.href = `tel:${props.to}`
      if (props.type === 'place') attributes.href = `https://www.google.com/maps/search/?api=1&query=${encodeURI(props.to)}`

      attributes.target = '_blank'
      attributes.rel = 'noreferrer'
    } else {
      attributes.href = props.to
    }
  } else if ('link_type' in props.to) {
    if (props.forceReload || props.openInNewTab) {
      attributes.href = props.to.url
    } else {
      attributes.field = props.to;
    }

  } else if ('path' in props.to || 'name' in props.to) {
    if (props.forceReload) {
      let href = router.resolve(props.to).href
      if (props.trailingSlash) {
        href = href.replace('?', '/?')
        if (!href.endsWith('/') && !href.includes('?')) href += '/'
      }
      attributes.href = href
    } else {
      attributes.to = props.to
    }
  } else {
    return null
  }

  attributes.title = props.title

  if (props.openInNewTab) {
    attributes.target = '_blank'
    attributes.rel = 'noreferrer'
  }

  return attributes
}

</script>
