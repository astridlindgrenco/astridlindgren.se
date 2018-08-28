var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = Hero
function Hero (image, isNarrow) {
  var { url, alt } = image
  if (url) {
    var classes = className('Hero', {
      'Hero--narrow': isNarrow
    })

    try {
      return html`
        <div class="${classes}">
          <div class="Hero-media">
            <img class="Hero-image"
              srcset="${image.low.url} 1x,
              ${image.medium.url} 2x,
              ${url} 3x"
              src="${url}" alt="${alt}">
          </div>
        </div>
      `
    } catch (ex) {
      console.log('[Renderer->Component->Hero] Responsive images are missing for: ' + url)

      return html`
        <div class="${classes}">
          <div class="Hero-media">
            <img class="Hero-image" src="${url}" alt="${alt}" />
          </div>
        </div>
      `
    }
  }
  return null
}
