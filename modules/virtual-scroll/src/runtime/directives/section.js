
export default (nuxtApp) => {
  const SECTION_OFFSET_MARGIN = 100
  const getTranslate = el => {
    const translate = {}
    if (!window.getComputedStyle) return

    const style = getComputedStyle(el)
    const transform = style.transform
    if (!transform) return { x: 0, y: 0 }

    let mat = transform.match(/^matrix3d\((.+)\)$/)

    if (mat) {
      translate.x = mat ? parseFloat(mat[1].split(', ')[12]) : 0
      translate.y = mat ? parseFloat(mat[1].split(', ')[13]) : 0
    } else {
      mat = transform.match(/^matrix\((.+)\)$/)
      translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0
      translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0
    }
    return translate
  }

  return {
    mounted (el) {
      const { $virtualScroll } = nuxtApp

      if (!$virtualScroll.active.value) return

      // Optimize transform
      el.style.willChange = 'transform'


      let isVisible = false

      // Listen to scroll event and update element transform on each call
      el.__scroll_callback__ = ({ lerp }) => {

        const { top, bottom } = el.getBoundingClientRect()
        let offset = {
          yStart: top - getTranslate(el).y - window.innerHeight - SECTION_OFFSET_MARGIN,
          yStop: bottom - getTranslate(el).y + SECTION_OFFSET_MARGIN
        }

        if (lerp > offset.yStart && lerp < offset.yStop) {
          el.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,${(lerp * -1)},0,1)`
          el.style.webkitTransform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,${(lerp * -1)},0,1)`
          el.style.msTransform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,${(lerp * -1)},0,1)`

          if (!isVisible) {
            isVisible = true
            el.style.pointerEvents = 'auto'
            el.style.opacity = 1
          }
        } else if (isVisible) {
          isVisible = false

          el.style.transform = 'translate3d(0px, 0px, 0px)'
          el.style.webkitTransform = 'translate3d(0px, 0px, 0px)'
          el.style.msTransform = 'translate3d(0px, 0px, 0px)'

          el.style.pointerEvents = 'none'
          el.style.opacity = 0
        }
      }
      $virtualScroll.on('scroll', el.__scroll_callback__)
    },
    unmounted (el) {
      // Get virtualScroll plugin
      const { $virtualScroll } = nuxtApp

      // Remove scroll event listener
      $virtualScroll.off('scroll', el.__scroll_callback__)
      delete el.__scroll_callback__
    }
  }
}
