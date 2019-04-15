'use strict'

/**
 * Renders character navigation (third level).
 */

const html = require('nanohtml')
const { getParents, getImmediateChildren, getSiblings } = require('../../resolve')
const raw = require('nanohtml/raw')
const { getCustomFontClass } = require('../base/fonts')
const { className } = require('../base/utils')
const palette = require('../base/palette')

module.exports = characterMenu

function characterMenu (state, currentPageId) {
  var navItems = []
  var parents = getParents(currentPageId)
  var level = parents.length + 1

  switch (level) {
    case 1:
      navItems = []
      break
    case 2:
      let children = getImmediateChildren(currentPageId)
                    .filter(hasMenuLabel)
                    .map(markActiveTrail(currentPageId))
      navItems = children
      break
    case 3:
      let siblings = getSiblings(currentPageId)
                    .filter(hasMenuLabel)
                    .map(markActiveTrail(currentPageId))
      navItems = siblings
      break
  }

  // Sort based in user defined numero
  if (navItems.length) navItems.sort((a, b) => a.numero - b.numero)

  var titleClasses = className('CharacterMenu-title', {
    [`${getCustomFontClass(state.font)}`]: !!state.font
  })
  var accent = state.character_menu ? state.character_menu.accent : false
  return html`
    <div class="CharacterMenuPerspective">
    <div class="CharacterMenu" data-container="charactermenu" ${raw(getStyles(accent))}>
      <div class="${titleClasses}"><a class="CharacterMenu-titleLink js-titleLink">${state.character_menu.title}<img class="CharacterMenu-toggle-icon" src="/character_menu_icon.svg"/></a></div>
      <div class="CharacterMenu-container">
        ${navItems.map(linkObj => {
          let linkClasses = className('CharacterMenu-link', {
            'CharacterMenu-link--active': linkObj.isActive
          })
          return html`<a class="${linkClasses}" href="${linkObj.path}"><span class="CharacterMenu-indicator"><img src="/icons/menu-right-arrow.svg"/></span>${linkObj.menuLabel}</a>`
        })}
      </div>
    </div>
    </div>
  `
}

function getStyles (accent) {
  if (!accent) return ''
  var bgColorHex = palette.getHexCode(accent)
  var bgColorRGB = bgColorHex ? hexToRGB(bgColorHex) : ''
  var bgStyle = bgColorHex ? `background-color: ${bgColorHex}` : ''
  var shadowStyle = bgColorHex ? `box-shadow: 15px 15px 0 0 rgba(${bgColorRGB.r}, ${bgColorRGB.g}, ${bgColorRGB.b}, 0.28)` : ''
  var styles = bgColorHex ? `style="${[bgStyle, shadowStyle].join(';')}"` : ''
  return styles
}

function hasMenuLabel (obj) {
  return Boolean(obj.menuLabel)
}

function markActiveTrail (targetId) {
  return function marker (linkObj) {
    if (linkObj.id === targetId) {
      linkObj.isActive = true
    }
    return linkObj
  }
}

function hexToRGB (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}
