'use strict'

/**
 * Returns html for subnavigation.
 * Sub navigation links are only visible if they are having a label.
 */

const html = require('nanohtml')
const { className } = require('../base/utils')

module.exports = subNavigation

function subNavigation (state) {
  if (!Array.isArray(state.subNav) || !state.subNav.length) return null

  if (state.subNav.some(hasLabel)) {
    return html`
      <div class="SubNav">
        ${state.subNav.map(subNavItem)}
      </div>
    `
  }

}

function subNavItem (link) {
    var classes = className('SubNav-link', {
      'SubNav-link--active': link.isActive
    })
    // XXX: add lang and parent page uid to href? "/{lang}/{parent_uid}/{uid}"
    return hasLabel(link)
            ? html`<a href="/${link.uid}" class="${classes}">${link.label}</a>`
            : ''
}

function hasLabel (link) {
  return Boolean(link.label.length)
}
