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

    console.log('[Render->Component->Subnavigation] Links count: ', state.subNav.length)

    if (state.subNav.some(hasLabel)) {
      return html`
        ${state.is_character_menu ? raw('<div class="SubNav-CharacterMenu-background" style="background-color:' + state.character_menu.accent + ';"></div>') : null}
        <div id="sub-menu" class="${state.is_character_menu ? 'SubNav-CharacterMenu' : 'SubNav'}"
          style="${state.character_menu ? ('background-color: ' + state.character_menu.accent + ';') : ''}">
          ${raw(state.is_character_menu ? '<div class="SubNav-CharacterMenu-Title"><a class="SubNav-title" href="#sub-menu">' + state.character_menu.title + '<span class="Subnav-toggle-icon">&#709;</span></a><a class="SubNav-close" href="#">' + state.character_menu.title + '<span class="Subnav-toggle-icon">&#708;</span></a></div>' : '')}
          <div class="SubNav-container">
            ${state.subNav.map(state.is_character_menu ? subNavCharacterItem : subNavItem)}
          </div>
        </div>
      `
    }
  } catch (ex) {
    console.log('[Render->Component->Subnavigation] threw: ', ex)
  }
}

function subNavItem (link) {
  if (hasLabel(link)) {
    const path = resolve(link, ctx)

    const classes = className('SubNav-link', {
      'SubNav-link--active': link.isActive
    })
    return html`
      <a href="${path}" class="${classes}">
        ${link.label}
      </a>
    `
  }
  return ''
}

function subNavCharacterItem (link) {
  if (hasLabel(link)) {
    const path = resolve(link, ctx)

    const classes = className('SubNav-link', {
      'SubNav-link--active': link.isActive
    })
    return html`
      <a href="${path}" class="${classes}">
        <span class="SubNav-indicator">></span> ${link.label}
      </a>
    `
  }
  return ''
}

function hasLabel (link) {
  if (!link.label) return
  return Boolean(link.label.length)
}
