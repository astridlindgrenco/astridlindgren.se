var html = require('nanohtml')
var palette = require('../base/palette')
var { className, image } = require('../base/utils')

module.exports = linkblock
function linkblock (props) {
  var bgClassName = palette.getClassName(props.bg)
  var hasImage = !!(props.image && props.image.url)
  console.log(props)

  const picture = hasImage ? image(props.image, ['qw-small', 'qw-medium', 'qw-large', 'qw-xlarge']) : null
  var classes = className('LinkBlock', {
    'LinkBlock--noImage': !hasImage,
    'LinkBlock--lowPriority': props.priority === 'low',
    [`u-bg${bgClassName}`]: props.bg,
    [`u-colorFor${bgClassName}`]: props.bg
  })
  return html`
    <a class="${classes}" href="${props.href}" aria-label="${props.label}">
      ${hasImage ? html`<img alt="${props.image.alt}" title="${props.image.copyright}" class="Image LinkBlock-img"
        src="${picture.src}"
        alt="${picture.alt}"
        srcset="${picture.srcset}"
        sizes="${picture.sizes}" />` : ''}
      <div class="LinkBlock-label">
        ${props.label}
      </div>
    </a>
  `
}
