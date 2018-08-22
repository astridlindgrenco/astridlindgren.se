var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = Hero
function Hero (image, isNarrow) {
  console.log('img', image.url)
  var { url, alt } = image
  if (url) {
    var classes = className('Hero', {
      'Hero--narrow': isNarrow
    })
    return html`
      <div class="${classes}">
        <div class="Hero-media">
          <img class="Hero-image" src="${url}" alt="${alt}" />
        </div>
      </div>
    `
  }
  return null
}
