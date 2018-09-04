'use strict'

/**
 * Find out which item in the primary and secondary header menu that should marked.
 * Either the page viewed is a parent page associeted directly with the menu item,
 * or it is a sub page.
 */
module.exports = async function updateNavigation (doc, ctx, next) {
  const parentId = ctx.state.params[0] || doc.data.parent_page.uid || doc.uid
  markMenuItem(parentId, ctx.state.navDocument.data.primary_links)
  markMenuItem(parentId, ctx.state.navDocument.data.secondary_links)
}

function markMenuItem (uid, links) {
  if (!Array.isArray(links)) return
  links.forEach(link => {
    link.isActive = link.source.uid === uid
  })
}
