'use strict'

var Prismic = require('prismic-javascript')
const locale = require('../../locale')

/**
 * Create sub navigation data according to the hierarchical content strategy,
 * which is: a child document is linked to a parent document. If the document
 * is a parent page, then it must find out the child pages, if any. If the document
 * is a child page it must find out it's siblings.
 */
module.exports = async function fetchSubnavigation (doc, ctx, next) {
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
