'use strict'

/**
 * Returns html for subnavigation.
 * Sub navigation links are only visible if they are having a label.
 */

const html = require('nanohtml')
const resolve = require('../../resolve')
const raw = require('nanohtml/raw')
const { className } = require('../base/utils')

module.exports = subNavigation

let ctx
function subNavigation (state, context) {
  ctx = context

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

  link.link_type = 'Document'
  link.type = 'page'

  const path = resolve(link, ctx)
  console.log('[Components->Subnavigation] resolved: ' + path)
  return hasLabel(link)
            ? html`<a href="${path}" class="${classes}">${link.label}</a>`
            : ''
}

function hasLabel (link) {
  return Boolean(link.label.length)
}
