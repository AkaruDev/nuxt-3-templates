export default (nuxtApp) => {
  return {
    created (el, options) {
      const { $smoothScroll } = nuxtApp
      $smoothScroll.start(el)

      if (typeof options?.value?.ratio === 'number') $smoothScroll.setRatio(options.ratio.value)
      if (typeof options?.value?.precision === 'number') $smoothScroll.setPrecision(options.precision.value)
    }
  }
}
