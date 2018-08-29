'use strict'

var Prismic = require('prismic-javascript')

/**
 * Create sub navigation data according to the hierarchical content strategy,
 * which is: a child document is linked to a parent document. If the document
 * is a parent page, then it must find out the child pages, if any. If the document
 * is a child page it must find out it's siblings.
 */
module.exports = async function fetchSubnavigation (doc, ctx, next) {
  if (!doc || !doc.data || !doc.data.parent_page || !doc.data.parent_page.id) return next()

  const options = { lang: ctx.state.lang, orderings: '[my.page.numero]' }
  const parentPage = doc.data.parent_page

  let subDocs = null
  if (parentPage.id) {
    // I'm a child page, look for my siblings
    subDocs = await ctx.prismic.query([
      Prismic.Predicates.at('my.page.parent_page', parentPage.id)
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
        isActive: subDoc.id === doc.id,
        parentUID: parentPage.uid || doc.uid
      })
    })
  }
}
