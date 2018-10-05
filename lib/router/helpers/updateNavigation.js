'use strict'

const { getParents } = require('../../resolve')

/**
 * Find out which item in the primary and secondary header menu that should marked.
 * It matches against the current document ID and all of it's parents
 */
module.exports = function updateNavigation (doc, ctx, next) {
  const parentsAndSelf = [...getParents(doc.id), { id: doc.id }]
  markMenuItem(parentsAndSelf, ctx.state.navDocument.data.primary_links)
  markMenuItem(parentsAndSelf, ctx.state.navDocument.data.secondary_links)
}

function markMenuItem (parentsAndSelf, links) {
  if (!Array.isArray(links)) return
  links.forEach(link => {
    var matchingParent = parentsAndSelf.find(linkObj => linkObj.id === link.source.id)
    link.isActive = Boolean(matchingParent)
  })
}
