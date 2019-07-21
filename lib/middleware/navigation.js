'use strict'
const { getParents } = require('../resolve')
const subNavigationMobile = require('../components/subnavigationmobile')

/**
 * After Router, fetch the navigation docuent according to language and find out
 * which menu item in the primary and secondary header menu that should marked.
 */
module.exports = async function navigation (ctx, next) {
  const options = { lang: ctx.state.lang }
  ctx.state.navDocument = await ctx.prismic.getSingle('navigation', options)
  ctx.assert(ctx.state.navDocument, 500, 'Content missing')

  const doc = ctx.state.pages.items[0]
  const parentsAndSelf = [...getParents(doc.id), { id: doc.id }]
  markMenuItem(parentsAndSelf, ctx.state.navDocument.data.primary_links)
  markMenuItem(parentsAndSelf, ctx.state.navDocument.data.secondary_links)
  return next()
}

function markMenuItem (parentsAndSelf, links) {
  if (!Array.isArray(links)) return
  links.forEach(link => {
    var matchingParent = parentsAndSelf.find(linkObj => linkObj.id === link.source.id)
    if (matchingParent) {
      link.subnavigation = subNavigationMobile(link.source.id)
      link.isActive = true
    }
  })
}
