var html = require('nanohtml')
var { image } = require('../base/utils/')

module.exports = Image
function Image (img, useSquareImage) {
  var mainImage = image(img, ['fw-small', 'fw-medium', 'fw-large', 'fw-xlarge'])
  var imageForLarge
  if (useSquareImage) imageForLarge = img.square ? image(img.square, ['hw-small', 'hw-medium', 'hw-large', 'hw-xlarge']) : false
  return html`
    <picture class="Card-image">
      ${imageForLarge
    ? html`
            <source media="(min-width: 1024px)"
            title="${imageForLarge.copyright || img.copyright}"
              alt="${imageForLarge.alt || mainImage.alt}"
           srcset="${imageForLarge.srcset || mainImage.srcset}"
            sizes="${imageForLarge.sizes || mainImage.sizes}">
          `
    : ''}
      <img class="Card-imageElm"
           title="${img.copyright}"
             alt="${mainImage.alt}"
          srcset="${mainImage.srcset}"
           sizes="${mainImage.sizes}"
             src="${mainImage.src}">
    </picture>
  `
}
