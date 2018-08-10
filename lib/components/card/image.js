var html = require('nanohtml')
var { inBrowser } = require('../base/utils')

module.exports = Image
function Image (image, useSquareImage) {
  var hasSquareImage = (useSquareImage && image.square)
  var { url, alt } = hasSquareImage ? image.square : image
  return html`
    <div class="Card-image" data-container="cardImage" data-images="${JSON.stringify(image)}" data-current-image-ratio="${ hasSquareImage ? 'square' : 'landscape' }">
      <img class="Card-imageElm" src="${url}" alt="${alt}" />
    </div>
  `
}
