'use strict'

/**
 * Returns html for subnavigation.
 * Sub navigation links are only visible if they are having a label.
 */

const html = require('nanohtml')
const { className } = require('../base/utils')

module.exports = subNavigation

function subNavigation (state) {
  try {
    if (!Array.isArray(state.subNav) || !state.subNav.length) return null

    if (state.subNav.some(hasLabel)) {
      return html`
        <div class="SubNav">
          <div class="SubNav-container">
            ${state.subNav.map(subNavItem)}
          </div>
        </div>
      `
    }
  } catch (ex) {
    console.log('[Components->Subnavigation] threw: ' + JSON.stringify(ex))
  }
}

function subNavItem (link) {
  const classes = className('SubNav-link', {
    'SubNav-link--active': link.isActive
  })
  if (hasLabel(link)) {
    const langCode = link.lang.substr(0, 2)
    let path = null
    switch (link.type) {
      case 'booklist':
        path = `${link.uid}`
        break
      case 'page':
        path = `${link.parentUID ? link.parentUID + '/' : null}${link.uid}`
        break
    }
    return html`
      <a href="/${langCode}/${path}" class="${classes}">
        ${link.label}
      </a>
    `
  }
  return ''
}

function hasLabel (link) {
  return Boolean(link.label.length)
}
