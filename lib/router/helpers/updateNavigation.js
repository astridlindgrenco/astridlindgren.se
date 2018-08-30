'use strict'

/**
 * Find out which item in the primary and secondary header menu that should marked.
 * Either the page viewed is a parent page associeted directly with the menu item,
 * or it is a sub page.
 */
module.exports = async function updateNavigation (doc, ctx, next) {
  const parentId = doc.data.parent_page.id || doc.id
  markMenuItem(parentId, ctx.state.navDocument.data.primary_links)
  markMenuItem(parentId, ctx.state.navDocument.data.secondary_links)
}

function markMenuItem (id, links) {
  if (!Array.isArray(links)) return
  links.forEach(link => {
    link.isActive = link.source.id === id
  })
}
