'use strict'

/**
 * Returns html for subnavigation.
 * Sub navigation links are only visible if they are having a label.
 */

const html = require('nanohtml')
const {linkResolver} = require('../../resolve')
const raw = require('nanohtml/raw')
const { getCustomFontClass } = require('../base/fonts')
const { className } = require('../base/utils')
const palette = require('../base/palette')

module.exports = subNavigation

function subNavigation (state, context, parentMenu) {
  try {
    if (!Array.isArray(state.subNav) || !state.subNav.length) return null

    console.log('[Render->Component->Subnavigation] Links count: ', state.subNav.length)

    if (state.subNav.some(hasLabel)) {
      return html`
        ${state.is_character_menu && !parentMenu
          ? raw(`<div class="SubNav-CharacterMenu-background" style="background-color: ${palette.getHexCode(state.character_menu.accent)};"></div>`) : null
        }

        ${raw(`<div class="${state.is_character_menu && !parentMenu ? 'SubNav-CharacterMenu' : 'SubNav'}"
          style="${state.character_menu && state.character_menu.accent ? ('background-color: ' + palette.getHexCode(state.character_menu.accent) + ';') : null}">`)}

          ${raw(state.is_character_menu && !parentMenu ? `<div class="SubNav-CharacterMenu-Title${state.font ? ' ' + getCustomFontClass(state.font) : ''}"><a class="SubNav-title" onclick="toggleMenu();">` + state.character_menu.title + '<img class="Subnav-toggle-icon" src="/character_menu_icon.svg"/></a></div>' : '')}
          <div class="SubNav-container">
            ${parentMenu && state.parentSubNav ? state.parentSubNav.map(subNavItem) : ''}
            ${!parentMenu ? state.subNav.map(state.is_character_menu ? subNavCharacterItem : subNavItem) : ''}
          </div>
        </div>

        ${state.is_character_menu && !parentMenu ? raw`
          <script>
            function toggleMenu () {
              var menu = document.querySelector('.SubNav-CharacterMenu')
              menu.classList.toggle('open');
            }
          </script>
        ` : null}
      `
    }
  } catch (ex) {
    console.log('[Render->Component->Subnavigation] threw: ', ex)
  }
}

function subNavItem (link) {
  if (hasLabel(link)) {
    const path = linkResolver(link)

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
    const path = linkResolver(link)

    const classes = className('SubNav-link', {
      'SubNav-link--active': link.isActive
    })
    return html`
      <a href="${path}" class="${classes}">
        <span class="SubNav-indicator"><img src="/icons/menu-right-arrow.svg"/></span> ${link.label}
      </a>
    `
  }
  return ''
}

function hasLabel (link) {
  if (!link.label) return
  return Boolean(link.label.length)
}
