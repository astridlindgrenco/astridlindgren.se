'use strict'

/**
 * Util helper functions for router level things.
 */

/**
 * Traverse document and pull all Prismic documents from links and
 * store them in the state per content type. (The fetchLinks query
 * cannot be used and linked_documents is deprecated.)
 */
module.exports = async function fetchLinks (doc, ctx, next) {
  // traverse and pull out all links
  const result = traverse([], doc)
  // console.log(result)
  const flattenResult = flatten(result)
  console.log(flattenResult)
  // query prismic
  // store in state
}

const isQuote = /\[quote_ref\]\[(link_type|id)\]/

/**
 * Traverse content and pick out quote_ref
 */
function traverse (result, obj, preKey) {
  if (!obj) return []
  if (typeof obj === 'object') {
    for (var key in obj) {
      traverse(result, obj[key], (preKey || '') + (preKey ? '[' + key + ']' : key))
    }
  } else {
    const props = preKey.split(/\]\[|\]$/).filter(w => w > '')
    // console.log(props)
    if (isQuote.test(preKey)) {
      result.push({
        key: props.slice(-1)[0],
        sliceType: props.slice(-2)[0],
        index: props.slice(-4)[0],
        val: obj
      })
    }
  }
  return result
}

function flatten (source) {
  let target = []
  let i = source.length / 2
  while (i-- > 0) {
    const linkType = source.pop()
    const id = source.pop()
    target.push({
      linkType: linkType.val,
      sliceType: linkType.sliceType,
      index: linkType.index,
      id: id.id
    })
  }
  return target
}
