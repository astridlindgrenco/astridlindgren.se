var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = Hero
function Hero (image, isNarrow) {
  var { url, alt } = image
  if (url) {
    var classes = className('Hero', {
      'Hero--narrow': isNarrow
    })

    const title = image.copyright || ''

    return html`
        <div class="${classes}">
          <div class="Hero-media">
            <div class="Hero-image" style="background-image: url(${url});" title="${title}">
              <!--img class="Hero-image" src="${url}" alt="${alt}" title="${title}"/-->
            </div>
          </div>
        </div>
      `
  }
  return null
}
