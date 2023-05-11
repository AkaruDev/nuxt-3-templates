/* eslint-disable no-console */
import slices from '../components/slices/index'
import { notNull } from './helpers'

export const getSlicesQueries = (sliceIds) => {
  return slices
    .filter(slice => sliceIds.includes(slice.sliceId))
    .map(slice => slice.query)
    .filter(notNull)
    .join('\n')
    .replace(/^\s*[\r\n]/gm, '')
    .replace(/ +/g, ' ')
}

export const formatSlices = async (slices = [], app, additionalDatas) => {
  if (!slices.length) { return [] }

  const promises = slices
    .map(slice => formatSlice(slice.slice_type, slice, app, additionalDatas))

  return (await Promise.all(promises))
    .filter(notNull)
}

export const formatSlice = async (sliceId, data, app, additionalDatas) => {
  const slice = slices.find(slice => slice.sliceId === sliceId)

  if (!slice) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Cannot find formatter for ${sliceId} slice`)
    }

    return undefined
  }

  try {
    return await slice?.format(data, app, additionalDatas)
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error formatting ${sliceId} slice`)
      console.log(err)
      console.log('data:', data)
    }

    return undefined
  }
}
