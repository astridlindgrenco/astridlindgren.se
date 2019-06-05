var html = require('nanohtml')
var { className } = require('../base/utils')
const { image } = require('../base/utils/')

module.exports = Hero
function Hero (img, isNarrow) {
  var { url, alt } = img
  if (url) {
    var classes = className('Hero', {
      'Hero--narrow': isNarrow
    })

    const title = img.copyright || ''
    const responsiveImg = image(img, ['fw-small', 'fw-medium', 'fw-large', 'fw-xlarge'])

    return html`
        <div class="${classes}">
          <div class="Hero-media">
            ${responsiveImg
    ? html`
                <img class="Hero-image"
                      src="${responsiveImg.src}"
                    title="${title}"
                      alt="${alt}"
                    srcset="${responsiveImg.srcset}"
                    sizes="${responsiveImg.sizes}">`
    : null
}
          </div>
        </div>
      `
  }
  return null
}
