'use strict'

/**
 * Util helper functions for router level things.
 */
var Prismic = require('prismic-javascript')
const locale = require('../locale')

module.exports = {
  fetchLinks,
  fetchSubnavigation,
  updateNavigation
}

/**
 * Traverse document and pull all Prismic documents from links and
 * store them in the state per content type.
 */
async function fetchLinks (doc, ctx, next) {
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

const isQuote = /\[quote_ref\]\[(link_type|id)\]/

/**
 * Traverse document object and pick out quote_ref. The result has two entities per quote.
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

/**
 * Create sub navigation data according to the hierarchical content strategy,
 * which is: a child document is linked to a parent document. If the document
 * is a parent page, then it must find out the child pages, if any. If the document
 * is a child page it must find out it's siblings.
 */
async function fetchSubnavigation (doc, ctx, next) {
  const langCode = locale.getCode(ctx.state.lang)
  const options = { lang: langCode, orderings: '[my.page.numero]' }
  let subDocs = null
  if (doc.data.parent_page.id) {
    // I'm a child page, look for my siblings
    subDocs = await ctx.prismic.query([
      Prismic.Predicates.at('my.page.parent_page', doc.data.parent_page.id)
    ], options)
  } else {
    // I'm a parent page, look for my children
    subDocs = await ctx.prismic.query([
      Prismic.Predicates.at('my.page.parent_page', doc.id)
    ], options)
  }
  ctx.state.subNav = []
  //  build menu items from subDocs
  if (Array.isArray(subDocs.results)) {
    subDocs.results.forEach(subDoc => {
      ctx.state.subNav.push({
        id: subDoc.id,
        uid: subDoc.uid,
        lang: subDoc.lang,
        title: subDoc.title,
        label: subDoc.data.menu_label,
        isActive: subDoc.id === doc.id
      })
    })
  }
}

/**
 * Find out which item in the primary and secondary header menu that should marked.
 * Either the page viewed is a parent page associeted directly with the menu item,
 * or it is a sub page.
 */
async function updateNavigation (doc, ctx, next) {
  let parentId = doc.data.parent_page.id || doc.id
  markMenuItem(parentId, ctx.state.navDocument.data.primary_links)
  markMenuItem(parentId, ctx.state.navDocument.data.secondary_links)
}

function markMenuItem (id, links) {
  links.forEach(link => {
    link.isActive = link.source.id === id
  })
}
