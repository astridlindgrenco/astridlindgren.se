'use strict'

/**
 * Find out which item in the primary and secondary header menu that should marked.
 * Either the page viewed is a parent page associeted directly with the menu item,
 * or it is a sub page.
 */
module.exports = async function updateNavigation (doc, ctx, next) {
  if (!doc || !doc.data || ((!doc.data.parent_page || !doc.data.parent_page.id) && !doc.id)) return

  let parentId = doc.data.parent_page.id || doc.id

  markMenuItem(parentId, ctx.state.navDocument.data.primary_links)
  markMenuItem(parentId, ctx.state.navDocument.data.secondary_links)
}

function markMenuItem (id, links) {
  if (!links || !id) return

  links.forEach(link => {
    if (!link || !link.isActive || !link.source || !link.source.id) return
    link.isActive = link.source.id === id
  })
}
