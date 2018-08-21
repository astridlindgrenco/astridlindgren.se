'use strict'

/**
 * Traverse document and pull all Prismic documents from links and
 * store them in the state per content type.
 */
module.exports = async function fetchLinks (doc, ctx, next) {
  // traverse document and pull out all links
  const traversedLinks = traverse([], doc)
  // compose links into single entities
  const composedLinks = compose(traversedLinks)
  if (Array.isArray(composedLinks)) {
    for (let i = 0; i < composedLinks.length; i++) {
      // query prismic
      const link = composedLinks[i]
      const doc = await ctx.prismic.getByID(link.id)
      ctx.assert(doc, 404, `404 NOT FOUND ${link.sliceType} ${link.id}`)
      // store in state
      if (!ctx.state.linkedDocuments) ctx.state.linkedDocuments = {}
      if (!ctx.state.linkedDocuments[link.sliceType]) ctx.state.linkedDocuments[link.sliceType] = new Map()
      ctx.state.linkedDocuments[link.sliceType].set(link.id, doc)
    }
  }
}

/**
 * What to links to out in json data.
 */
const isQuote = /\[quote_ref\]\[(link_type|id)\]/
const isBook = /\[book\]\[(link_type|id)\]/

/**
 * Traverse document object and pick out links.
 *
 * FIXME: Just check for "isBroken", since all refs automatically inherits it,
 * that way we don't have to manually add every ref type.
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
    if (isQuote.test(preKey) || isBook.test(preKey)) {
      // the result has two entities per quote.
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

/**
 * Compose information about quotes into single enteties.
 */
function compose (source) {
  let target = []
  let i = source.length / 2
  while (i-- > 0) {
    const linkType = source.pop()
    const id = source.pop()
    target.push({
      linkType: linkType.val,
      sliceType: linkType.sliceType,
      index: linkType.index,
      id: id.val
    })
  }
  return target
}
