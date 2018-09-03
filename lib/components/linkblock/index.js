var html = require('nanohtml')
var palette = require('../base/palette')
var { className } = require('../base/utils')

module.exports = linkblock
function linkblock ({label, href, image, bg, priority = 'high'}) {
  var bgClassName = palette.getClassName(bg)
  var hasImage = image && image.url
  var classes = className('LinkBlock', {
    'LinkBlock--noImage': !hasImage,
    'LinkBlock--lowPriority': priority === 'low',
    [`u-bg${bgClassName}`]: bg,
    [`u-colorFor${bgClassName}`]: bg
  })
  return html`
    <a class="${classes}" href="${href}" aria-label="${label}">
      ${hasImage ? html`<img class="LinkBlock-img" src="${image.url}" alt="${image.alt}" title="${image.copyright}">` : ''}
      <div class="LinkBlock-label">
        ${label}
      </div>
    </a>
  `
}
