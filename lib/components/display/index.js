'use strict'

/**
 * A book stand display book covers in a horisonal way.
 * The book stand has a title and a read more link.
 */

var html = require('nanohtml')
var { className } = require('../base/utils')

const defaultShown = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 4
}

module.exports = function display (state, items, shown = defaultShown, wrap = false) {
  var cellClasses = className('Grid-cell', Object.assign({
    'u-textCenter': true
  }, getCellClasses(shown)))
  return html`
    <div class="Display">
      <div class="Grid Grid--shelf${wrap ? ' Wrap--shelf' : ''}">
        ${items.map(item => html`
          <div class="${cellClasses}">
          ${DisplayItem(item)}
          </div>
        `)}
      </div>
    </div>
  `
}

function DisplayItem ({ cover, info, type, isRoundCover }) {
  var classes = className('Display-item', {
    [`Display-item--${type}`]: !!type,
    'Display-item--roundCrop': isRoundCover,
    'u-colorForWhite': isRoundCover && type && type === 'date'
  })
  return html`
    <div class="${classes}">
      <div class="Display-cover">
        ${cover}
      </div>
      <div class="Display-info">
        ${info}
      </div>
    </div>
  `
}

/**
 * Creates config for className helper
 * @param  {Object} config Key value pair of breakpoint shortcut name and number of items to be displayed
 * @return {Object}        Object with all configs
 */
function getCellClasses (config) {
  var classConfigs = Object.entries(config).map(function makeClassConfig ([bp, numItems]) {
    return { [`u-${bp}-shelfOf${numItems}`]: true }
  })
  return Object.assign({}, ...classConfigs)
}
