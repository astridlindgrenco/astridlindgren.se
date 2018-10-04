'use strict'

/**
 * Returns html for subnavigation.
 * Sub navigation links are only visible if they are having a label.
 */

const html = require('nanohtml')
const { linkResolver, getParents, getImmediateChildren, getSiblings } = require('../../resolve')
const raw = require('nanohtml/raw')
const { getCustomFontClass } = require('../base/fonts')
const { className } = require('../base/utils')
const palette = require('../base/palette')

module.exports = newSubNavigation

function newSubNavigation (state, {
  currentPageId,
  renderThirdLevel = false
}) {
  var secondLevelItems = []
  var thirdLevelItems = []
  var parents = getParents(currentPageId)
  var level = parents.length + 1

  switch (level) {
    case 1:
      // First level just renders it's children
      var children = getImmediateChildren(currentPageId)
                    .filter(hasMenuLabel)
      secondLevelItems = children
      break
    case 2:
      // Second level renders it's own siblings...
      let siblings = getSiblings(currentPageId)
                    .filter(hasMenuLabel)
                    .map(markActiveTrail(currentPageId))
      secondLevelItems = siblings

      // ... and it's own children (in a separate nav) if that option is set
      if (renderThirdLevel) {
        let children = getImmediateChildren(currentPageId)
                      .filter(hasMenuLabel)
                      .map(markActiveTrail(currentPageId))
        thirdLevelItems = children
      }
      break
    case 3:
      // Third level level renders it's immedieate parent's siblings...
      let parentsSiblings = getSiblings(parents[0].id)
                            .filter(hasMenuLabel)
                            .map(markActiveTrail(parents[0].id))
      secondLevelItems = parentsSiblings

      // ... and it's own siblings (in a separate nav) if that option is set
      if (renderThirdLevel) {
        let siblings = getSiblings(currentPageId)
                      .filter(hasMenuLabel)
                      .map(markActiveTrail(currentPageId))
        thirdLevelItems = siblings
      }
      break
  }

  // Sort based in user defined numero
  if (secondLevelItems.length) secondLevelItems.sort((a, b) => a.numero - b.numero)
  if (thirdLevelItems.length) thirdLevelItems.sort((a, b) => a.numero - b.numero)

  return html`
    ${secondLevelNav(secondLevelItems, state.character_menu.accent)}
    ${thirdLevelNav(thirdLevelItems, state.character_menu.accent, state.font, state.character_menu.title)}
  `
}

function secondLevelNav (items, accent) {
  if (!items.length) return
  return html`
    <div class="SubNav" ${raw(getStyles(accent))}>
      <div class="SubNav-container">
        ${items.map(linkObj => {
          return html`<a class="SubNav-link${linkObj.isActive ? ' SubNav-link--active' : ''}" href="${linkObj.path}">${linkObj.menuLabel}</a>`
        })}
      </div>
    </div>
  `
}

function thirdLevelNav (items, accent, font, title) {
  if (!items.length) return
  var titleClasses = className('SubNav-CharacterMenu-Title', {
    [`${getCustomFontClass(font)}`]: !!font
  })
  return html`
    <div class="SubNav-CharacterMenu" ${raw(getStyles(accent, true))}>
      <div class="${titleClasses}"><a class="SubNav-title" onclick="toggleMenu();">${title}<img class="Subnav-toggle-icon" src="/character_menu_icon.svg"/></a></div>
      <div class="SubNav-container">
        ${items.map(linkObj => {
          let linkClasses = className('SubNav-link', {
            'SubNav-link--active': linkObj.isActive
          })
          return html`<a class="${linkClasses}" href="${linkObj.path}"><span class="SubNav-indicator"><img src="/icons/menu-right-arrow.svg"/></span>${linkObj.menuLabel}</a>`
        })}
      </div>
    </div>
    <script>
      function toggleMenu () {
        var menu = document.querySelector('.SubNav-CharacterMenu')
        menu.classList.toggle('open');
      }
    </script>
  `
}

function getStyles (accent, hasShadow = false) {
  if (!accent) return ''
  var bgColorHex = palette.getHexCode(accent)
  var bgColorRGB = hasShadow && bgColorHex ? hexToRGB(bgColorHex) : ''
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
