'use strict'

/**
 * Renders Subnavigation for mobile menu
 * Sub navigation links are only visible if they have a label.
 */

const html = require('nanohtml')
const { getParents, getImmediateChildren, getSiblings } = require('../../resolve')

module.exports = subNavigationMobile

function subNavigationMobile (currentPageId) {
  var secondLevelItems = []
  var parents = getParents(currentPageId)
  var level = parents.length + 1
  switch (level) {
    case 1:
      // First level just renders it's children
      var children = getImmediateChildren(currentPageId)
        .filter(hasMenuLabel)
        .map(markActiveTrail(currentPageId))
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
  return html`
    <div class="SubNav-Mobile">
      <ul class="SubNav-container-mobile">
        ${secondLevelItems.map(linkObj => {
    return html`<li class="SubNav-link-mobile-container"><a class="SubNav-link-mobile${linkObj.isActive ? ' SubNav-link-mobile--active' : ''}" href="${linkObj.path}">${linkObj.menuLabel}</a></li>`
  })}
      </ul>
    </div>
  `
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
