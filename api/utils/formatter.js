import { hasKey, isObject, isEmptyObject, filterObjectKeys, toArrayIfNeeded, stripTags, createEllispis, isValidRelationShip } from './helpers'

class Formatter {
  setPrismic (prismic) {
    this.$prismic = prismic
  }

  /**
   *
   * Fields
   *
   */

  formatTitle (title) {
    return this.formatRichText(title)
  }

  formatRichText (richText, { removeWrappingPTag = false, ellispsis } = {}) {

    if (!richText || richText.length === 0) { return undefined }

    if (typeof richText === 'string') { return richText }

    if (ellispsis) {
      const text = this.$prismic.asText(richText)
        .replace(/(?:\r\n|\r|\n|\t|\s\s+)/g, ' ')
        .trim()

      return createEllispis(text, ellispsis)
    }

    let html = this.$prismic.asHTML(richText)


    if (html.replace(/^<p[^>]*>|<\/p>$/g, '').length === 0) { return undefined }

    if (removeWrappingPTag) {
      html = html.replace(/^<p[^>]*>|<\/p>$/g, '')
    }

    return html
  }

  formatImage (image, { views: requiredViews, includeDimensions = true } = {}) {
    if (!image || isEmptyObject(image) || Object.values(image).every(imageFormat => isEmptyObject(imageFormat))) { return undefined }

    requiredViews = toArrayIfNeeded(requiredViews)

    // Extract responsive views and create defaultView
    const { dimensions, alt, url, ...responsiveViews } = image
    // copyright: _,
    let allViews = {
      ...responsiveViews,
      Main: {
        url,
        alt,
        dimensions
      }
    }
    // Filter with requiredViews and conditional include dimensions
    allViews = Object.entries(allViews)
      .reduce((acc, [responsiveViewName, responsiveView]) => {
        if (requiredViews && !requiredViews.includes(responsiveViewName) || !responsiveView) { return acc }
        const { url, alt, dimensions } = responsiveView

        acc[responsiveViewName] = {
          url,
          alt,
          ...(includeDimensions
            ? {
              width: dimensions.width,
              height: dimensions.height
            }
            : {})
        }

        return acc
      }, {})

    if (Object.keys(allViews).length === 0) { return undefined }
    if (Object.keys(allViews).length === 1) { return allViews[Object.keys(allViews)[0]] }

    const { Main, ...restViews } = allViews

    return {
      ...Main,
      ...restViews
    }
  }

  formatRelationship (relationship, { validTypes, fields = ['id', 'type', 'uid', 'lang', 'link_type', 'url'] } = {}) {
    if (!isValidRelationShip(relationship, validTypes)) { return undefined }

    return {
      ...filterObjectKeys(relationship, fields),
      link_type: 'Document',
    }
  }

  formatLink (link, options) {
    if (!link || link.link_type === 'Any') { return undefined }

    if (link.link_type === 'Document') {
      const to = this.formatRelationship(link, options)

      if (to) { return { to } }
    }

    if (link.link_type === 'Media') {
      const to = this.formatLinkToMedia(link, options)

      if (to) { return { to } }
    }

    return {
      to: link
    }
  }

  formatLinkToMedia (mediaLink, { validKinds, validExtensions, fields = ['link_type', 'name', 'url'] } = {}) {
    validKinds = toArrayIfNeeded(validKinds)
    validExtensions = toArrayIfNeeded(validExtensions)

    if (!mediaLink || !mediaLink.link_type === 'Media' || !hasKey('url')(mediaLink) || (validKinds && !validKinds.includes(mediaLink.kind))) { return undefined }

    const extension = mediaLink.name.split('.').pop()

    if (validExtensions && !validExtensions.includes(extension)) { return undefined }

    return filterObjectKeys(mediaLink, fields)
  }

  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
  formatDate (date, { locale, options, format } = {}) {
    if (!date) { return undefined }

    options = {
      ...{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      ...options
    }

    format = format || (({ day, month, year }) => `${day} ${month} ${year}`)

    const dateObj = new Date(date)

    const weekday = new Intl.DateTimeFormat(locale, { weekday: options.weekday }).format(dateObj)
    const day = new Intl.DateTimeFormat(locale, { day: options.day }).format(dateObj)
    const month = new Intl.DateTimeFormat(locale, { month: options.month }).format(dateObj)
    const year = new Intl.DateTimeFormat(locale, { year: options.year }).format(dateObj)

    return format({ weekday, day, month, year })
  }

  formatTimestamp (timestamp, { locale, options, format } = {}) {
    if (!timestamp) { return undefined }

    options = {
      ...{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      ...options
    }

    format = format || (({ minute, hour, weekday, day, month, year }) => `${hour}:${minute}, ${weekday} ${day} ${month} ${year}`)

    const dateObj = new Date(timestamp)

    const minute = dateObj.getMinutes().toString().padStart(2, '0')
    const hour = dateObj.getHours().toString().padStart(2, '0')
    const weekday = new Intl.DateTimeFormat(locale, { weekday: options.weekday }).format(dateObj)
    const day = new Intl.DateTimeFormat(locale, { day: options.day }).format(dateObj)
    const month = new Intl.DateTimeFormat(locale, { month: options.month }).format(dateObj)
    const year = new Intl.DateTimeFormat(locale, { year: options.year }).format(dateObj)

    return format({ minute, hour, weekday, day, month, year })
  }

  formatColor (color, { convertToRgb = false, alpha, fullDetails = false } = {}) {
    if (!color) { return undefined }

    if (convertToRgb || fullDetails) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)

      if (!result) { return color }

      const r = parseInt(result[1], 16)
      const g = parseInt(result[2], 16)
      const b = parseInt(result[3], 16)
      const rgb = alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`

      return fullDetails ? { hex: color, r, g, b, rgb } : rgb
    }

    return color
  }

  formatNumber (number) {
    if (typeof number !== 'number') { return undefined }

    return number
  }

  formatKeyText (text, { ellispsis } = {}) {
    if (!text) { return undefined }

    text = this.endOfSentenceUnbreakableSpace(text)

    if (ellispsis) { return createEllispis(text, ellispsis) }

    return text
  }

  endOfSentenceUnbreakableSpace (text) {
    // ?!:€
    if (typeof text === 'string') {
      text = text.split(/\u0020\u003A/g).join('\u00A0\u003A')
      text = text.split(/\u0020\u20AC/g).join('\u00A0\u20AC')
      text = text.split(/\u0020\u003F/g).join('\u00A0\u003F')
      text = text.split(/\u0020\u0021/g).join('\u00A0\u0021')
    }

    return text
  }

  formatSelect (selectValue, { valueMapping } = {}) {
    if (!selectValue) { return undefined }

    return valueMapping ? (valueMapping[selectValue] || selectValue) : selectValue
  }

  formatEmbed (embed, { fields = ['provider_name', 'title', 'video_id', 'thumbnail_url', 'embed_url'] } = {}) {
    if (!embed || isEmptyObject(embed)) { return undefined }

    if (embed.provider_name === 'Vimeo') {
      const customControlsAvailable = embed.account_type && embed.account_type !== 'basic'

      return {
        ...filterObjectKeys(embed, fields),
        customControlsAvailable
      }
    } else if (embed.provider_name === 'YouTube') {
      return filterObjectKeys(embed, fields)
    } else if (embed.provider_name === 'website') {
      return filterObjectKeys(embed, fields)
    }

    return embed
  }

  formatGeopoint (geopoint) {
    if (!geopoint || isEmptyObject(geopoint)) { return undefined }

    return geopoint
  }

  /**
   *
   * Special Groups
   *
   */

  formatMetas (metasGroup, { defaults } = {}) {
    let imageUrl = (this.formatImage(metasGroup?.image) || defaults?.image)?.url

    if (imageUrl) {
      imageUrl = new URL(imageUrl)
      imageUrl.searchParams.set('auto', 'compress')
      imageUrl.searchParams.set('fm', 'jpg')
      imageUrl = imageUrl.href
    }

    return {
      title: this.formatKeyText(metasGroup?.title) || defaults?.title,
      description: this.formatKeyText(metasGroup?.description) || stripTags(defaults?.description),
      image: imageUrl
    }
  }

  formatButton (ctaGroup, { linkFormatterOptions, requiredLink = true } = {}) {
    if (!ctaGroup || !isObject(ctaGroup)) { return undefined }

    const link = this.formatLink(ctaGroup?.link, linkFormatterOptions)
    if (requiredLink && isEmptyObject(link)) { return undefined }

    if (link) { link.title = this.formatKeyText(ctaGroup.title) || this.formatKeyText(ctaGroup.label) }

    return {
      label: this.formatKeyText(ctaGroup.label),
      ...link
    }
  }
}

export default new Formatter()
