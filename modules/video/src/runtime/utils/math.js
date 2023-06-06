/**
 * Fit one size into another
 * @param {width,height} from
 * @param {width,height} to
 * @returns
 */
function fit (from, to) {
  const ratios = { from: from.width / from.height, to: to.width / to.height }
  const pos = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  if (ratios.from < ratios.to) {
    pos.width = to.width
    pos.height = Math.ceil(pos.width / ratios.from)
    pos.y = Math.ceil(-(pos.height - to.height) * 0.5)
  } else {
    pos.height = to.height
    pos.width = Math.ceil(pos.height * ratios.from)
    pos.x = Math.ceil(-(pos.width - to.width) * 0.5)
  }

  return pos
}


export { fit }
