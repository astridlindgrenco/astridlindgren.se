'use strict'

/**
 * A book stand display book covers in a horisonal way.
 * The book stand has a title and a read more link.
 */

var { asText } = require('prismic-richtext')
var html = require('nanohtml')

module.exports = function display (state, items) {
  return html`
    <div class="Display">
      <div class="Grid Grid--shelf">
        ${items.map(item => DisplayItem(item, items.length))}
      </div>
    </div>
  `
}

function DisplayItem ({cover, info, type}, numItems) {
  return html`
    <div class="Grid-cell u-textCenter">
      <div class="Display-item ${`Display-item--${type}`}">
        <div class="Display-cover">
          ${cover}
        </div>
        <div class="Display-info">
          <div class="Text Text--smaller">
            ${info}
          </div>
        </div>
      </div>
    </div>
  `
}
