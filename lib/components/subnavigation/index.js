'use strict'

/**
 * Returns html for subnavigation.
 * Sub navigation links are only visible if they are having a label.
 */

const html = require('nanohtml')
const raw = require('nanohtml/raw')
const { className } = require('../base/utils')

module.exports = subNavigation

function subNavigation (state) {
  try {
    if (!Array.isArray(state.subNav) || !state.subNav.length) return null

    if (state.subNav.some(hasLabel)) {
      return html`
        <div class="${state.is_character_menu ? 'SubNav-CharacterMenu' : 'SubNav'}"
          style="${state.character_menu ? ('background-color: ' + state.character_menu.accent + ';') : ''}">
          ${raw(state.is_character_menu ? '<div class="SubNav-CharacterMenu-Title">' + state.character_menu.title + '</div>' : '')}
          <div class="SubNav-container">
            ${state.subNav.map(subNavItem)}
          </diV>
        </div>
      `
    }
  } catch (ex) {
    console.log('[Components->Subnavigation] threw: ' + JSON.stringify(ex))
  }
}

function subNavItem (link) {
  var classes = className('SubNav-link', {
    'SubNav-link--active': link.isActive
  })
  return hasLabel(link)
            ? html`<a href="/${link.lang.substr(0, 2)}/${link.parentUID ? link.parentUID + '/' : null}${link.uid}" class="${classes}">${link.label}</a>`
            : ''
}

function hasLabel (link) {
  return Boolean(link.label.length)
}
