'use strict'

/**
 * Returns html for subnavigation.
 * Sub navigation links are only visible if they are having a label.
 */

const raw = require('nanohtml/raw')

module.exports = function subnavigation (state) {
  let body = null
  if (Array.isArray(state.subNav) && state.subNav.length > 0) {
    if (state.subNav.some(hasLabel)) {
      body = '<div class="subnavigation">'
      state.subNav.forEach(link => {
        if (hasLabel(link)) {
          const cssClass = link.isActive
            ? 'subnavigation-link subnavigation-link--active'
            : 'subnavigation-link'
          // XXX: add lang and parent page uid to href? "/{lang}/{parent_uid}/{uid}"
          body += `<a href="/${link.uid}" class="${cssClass}">${link.label}</a>`
        }
      })
      body += '</div>'
    }
  }
  return raw(body)
}

function hasLabel (link) {
  return link.label > ''
}
