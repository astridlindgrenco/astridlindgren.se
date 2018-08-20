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
        ${items.map(DisplayItem)}
      </div>
    </div>
  `
}

function DisplayItem ({cover, info, type}) {
  return html`
    <div class="Display-item ${`Display-item--${type}`}">
      <div class="Display-cover">
        ${cover}
      </div>
      <div class="Display-info">
        <div class="Text">
          ${info}
        </div>
      </div>
    </div>
  `
  /*
  switch (type) {
    case 'book': {
      let book = item
      let title = book.data.book_title[0].text
      return html`
        <div class="Display-item ${`Display-item--${type}`}">
          <div class="Display-cover">
            ${cover}
          </div>
          <div class="Display-info">
            <div class="Text">
              ${info}
            </div>
          </div>
        </div>
      `
    }

    case 'quote':
    case 'character':
      return item.type

    default:
      return ''
  }*/
}
