# Description

Add PageLoader and PageTransition components for preloading assets before entering the site.

## How to use in every pages
```
// Last line in your setup function
definePageMeta(useTransition())
```

## How to use with featues/viewport-observer
In the configs/viewport-observer set active to false.
In PageLoader.vue set active value just before hide is complete.

```
const { $viewportObserver } = useNuxtApp()

const hide = () => {
    $viewportObserver.active.value = true
}
```

In PageTransition.vue set active value to false on show. Just before hide is complete set it to true.

```
const { $viewportObserver } = useNuxtApp()

const show = ({ done }) => {
    $viewportObserver.active.value = false
}

const hide = () => {
    $viewportObserver.active.value = true
}
```
