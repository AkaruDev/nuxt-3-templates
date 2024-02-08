// Remove duplicates in a flat array
export const removeDuplicates = (arr) => {
  if (!Array.isArray(arr)) { return arr }

  return [...new Set(arr)]
}

// Reove duplicates according key in an array of objects
export const removeDuplicatesWithKey = (arr, key) => {
  if (!Array.isArray(arr)) { return arr }

  return [...new Map(arr?.map(item => [item[key], item])).values()]
}

// Ensure obj has all keys and not falsy
export const hasKeys = keys => obj => !!obj && keys.every(key => key in obj && !!obj[key])

// Ensure obj has one of keys and not falsy
export const hasKeysOr = keys => obj => !!obj && keys.some(key => key in obj && !!obj[key])

// Ensure obj has key and not falsy
export const hasKey = key => obj => !!obj && key in obj && !!obj[key]

// Ensure value is not null
export const notNull = value => !!value

// Convert each key of an object to kamel case
export const convertKeysToCamelCase = (obj) => {
  return Object.entries(obj)
    .reduce((acc, [key, value]) => {
      acc[snakeToCamel(key)] = value

      return acc
    }, {})
}

// Convert string to kamel case
export const snakeToCamel = str => str.replace(
  /([-_][a-z])/g,
  group => group.toUpperCase()
    .replace('-', '')
    .replace('_', '')
)

// Return an array which has a length between min and max
// ignoreMax = true migt give an array with length superior to max, but items are not next to themselves
export const minMaxArray = (arr = [], min = 0, max = min, ignoreMax = false) => {
  if (arr.length >= min && arr.length <= max) { return arr }
  if (arr.length > max) { return arr.slice(0, max) }
  return Array(Math.ceil(min / arr.length))
    .fill(arr)
    .flat()
    .slice(0, ignoreMax ? undefined : max)
}

export const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj)

export const isEmptyObject = obj => isObject(obj) && Object.keys(obj).length === 0

// Return a new object with only keys parameter from object parameter
export const filterObjectKeys = (object, keys) => {
  if (!keys) { return object }

  return keys.reduce((acc, key) => {
    acc[key] = object[key]
    return acc
  }, {})
}

// Transform value to array if maybeArray exists and is not an array
export const toArrayIfNeeded = maybeArray => (maybeArray && !Array.isArray(maybeArray)) ? [maybeArray] : maybeArray

export const isValidRelationShip = (relationShip, validTypes) => {
  validTypes = toArrayIfNeeded(validTypes)

  if (!relationShip || !!relationShip.isBroken || !relationShip.id || (validTypes?.length > 0 && !validTypes.includes(relationShip.type))) { return false }

  return true
}

// Strip HTML tags
export const stripTags = string => string?.replace(/(<([^>]+)>)/gi, '')

/**
 * Create ellipsis
 *
 * @param {String} str
 * @param {Object} options
 * @param {Number} options.maxChars
 * @param {Boolean} options.pretty
 * @param {String} options.suffix
 * @param {Boolean} options.maxCharsIncludesSuffix
 *
 * @returns {String} str parameter reduced to maxChars
 */
export const createEllispis = (str, { maxChars = 0, pretty = true, suffix = '...', maxCharsIncludesSuffix = true } = {}) => {
  if (!str) { return undefined }
  if (str.length < maxChars) { return str }

  const realMaxChars = maxCharsIncludesSuffix ? maxChars - suffix?.length : maxChars

  if (pretty) {
    return (
      str
        .split(' ')
        .reduce((acc, curr, _, arr) => {
          if (acc.totalLength + curr.length >= realMaxChars) {
            // eject early
            arr.splice(1)
            return acc
          }

          acc.words.push(curr)
          acc.totalLength += curr.length

          return acc
        }, { words: [], totalLength: 0 })
        .words
        .join(' ')
        .concat(suffix)
    )
  } else {
    return str
      .slice(0, realMaxChars)
      .concat(suffix)
  }
}

export const slugify = (text) => {
  return text
    .toString()                   // Cast to string (optional)
    .normalize('NFKD')            // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, '')// deletes all the accents, which happen to be all in the \u03xx UNICODE block
    .toLowerCase()                  // Convert the string to lowercase letters
    .trim()                         // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\\-]+/g, '')     // Remove all non-word chars
    .replace(/\\_/g, '-')          // Replace _ with -
    .replace(/\\-\\-+/g, '-')       // Replace multiple - with single -
    .replace(/\\-$/g, '');         // Remove trailing -
}

