var html = require('nanohtml')
var palette = require('../base/palette')
var { className, image } = require('../base/utils')

module.exports = linkblock
function linkblock ({label, href, img, bg, priority = 'high'}) {
  var bgClassName = palette.getClassName(bg)
  var hasImage = img && img.url

  const picture = hasImage ? image(img, ['qw-small', 'qw-medium', 'qw-large', 'qw-xlarge']) : null
  var classes = className('LinkBlock', {
    'LinkBlock--noImage': !hasImage,
    'LinkBlock--lowPriority': priority === 'low',
    [`u-bg${bgClassName}`]: bg,
    [`u-colorFor${bgClassName}`]: bg
  })
  return html`
    <a class="${classes}" href="${href}" aria-label="${label}">
      ${hasImage ? html`<img alt="${img.alt}" title="${img.copyright}" class="Image LinkBlock-img"
        src="${picture.src}"
        alt="${picture.alt}"
        srcset="${picture.srcset}"
        sizes="${picture.sizes}" />` : ''}
      <div class="LinkBlock-label">
        ${label}
      </div>
    </a>
  `
}
