var html = require('nanohtml')
var { image } = require('../base/utils/')

module.exports = Image
function Image (img, useSquareImage) {
  var hasSquareImage = (useSquareImage && img.square)
  const rawImage = hasSquareImage ? img.square : img
  const width = hasSquareImage ? 'hw' : 'fw'
  const responsiveImage = image(rawImage, [`${width}-small`, `${width}-medium`, `${width}-large`, `${width}-xlarge`])
  return html`
    <div class="Card-image" data-container="cardImage" data-images="${JSON.stringify(responsiveImage.src)}" data-current-image-ratio="${hasSquareImage ? 'square' : 'landscape'}">
      <img class="Card-imageElm"
           title="${responsiveImage.copyright}"
             alt="${responsiveImage.alt}"
          srcset="${responsiveImage.srcset}"
           sizes="${responsiveImage.sizes}"
             src="${responsiveImage.src}">
    </div>
  `
}
