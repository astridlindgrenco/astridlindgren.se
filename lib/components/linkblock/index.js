var html = require('nanohtml')
var { Link } = require('prismic-dom')
var linkResolver = require('../../resolve')
var palette = require('../base/palette')
var { className } = require('../base/utils')

module.exports = linkblock
function linkblock (label, source, image, bg) {
  var bgClassName = palette.getClassName(bg)
  var href = Link.url(source, linkResolver)
  var id = label.replace('/\s|[^a-z]/g', '').toLowerCase()
  var classes = className('LinkBlock', {
    'LinkBlock--noImage': !image,
    [`u-bg${bgClassName}`]: !image
  })
  return html`
    <a class="${classes}" href="${href}" aria-label="${label}">
      ${image ? html`<img class="LinkBlock-img" src="${image.url}" alt="${image.alt}">` : ''}
      <div class="LinkBlock-label">
        ${label}
      </div>
    </a>
  `
}
