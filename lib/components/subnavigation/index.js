'use strict'

/**
 * Renders Subnavigation.
 * Sub navigation links are only visible if they have a label.
 */

const html = require('nanohtml')
const { getParents, getImmediateChildren, getSiblings } = require('../../resolve')
const raw = require('nanohtml/raw')
const palette = require('../base/palette')

module.exports = newSubNavigation

function newSubNavigation (state, currentPageId) {
  var secondLevelItems = []
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
      break
    case 3:
      // Third level level renders it's immedieate parent's siblings...
      let parentsSiblings = getSiblings(parents[0].id)
                            .filter(hasMenuLabel)
                            .map(markActiveTrail(parents[0].id))
      secondLevelItems = parentsSiblings
      break
  }

  // Sort based in user defined numero
  if (secondLevelItems.length) secondLevelItems.sort((a, b) => a.numero - b.numero)
  var accent = state.character_menu ? state.character_menu.accent : false
  return html`
    <div class="SubNav" ${raw(getStyles(accent))}>
      <div class="SubNav-container">
        ${secondLevelItems.map(linkObj => {
          return html`<a class="SubNav-link${linkObj.isActive ? ' SubNav-link--active' : ''}" href="${linkObj.path}">${linkObj.menuLabel}</a>`
        })}
      </div>
    </div>
  `
}

function getStyles (accent) {
  if (!accent) return ''
  var bgColorHex = palette.getHexCode(accent)
  var bgStyle = bgColorHex ? `background-color: ${bgColorHex};` : ''
  var styles = bgColorHex ? `style="${bgStyle}"` : ''
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
