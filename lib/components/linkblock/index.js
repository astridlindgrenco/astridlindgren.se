var html = require('nanohtml')
var palette = require('../base/palette')
var { className, image } = require('../base/utils')

module.exports = linkblock
function linkblock (props) {
  var bgClassName = palette.getClassName(props.bg)
  var hasImage = !!(props.image && props.image.url)

  const picture = hasImage ? image(props.image, ['qw-small', 'qw-medium', 'qw-large', 'qw-xlarge']) : null
  var classes = className('LinkBlock', {
    'LinkBlock--noImage': !hasImage,
    // Temporarily removed the low-priority feature which hides the last block on tablet-sized displays
    // 'LinkBlock--lowPriority': props.priority === 'low',
    [`u-bg${bgClassName}`]: props.bg
  })
  return html`
    <a class="${classes}" href="${props.href}" aria-label="${props.label}">
      ${hasImage
        ? html`
          <img class="Image LinkBlock-img"
            title="${props.image.copyright}"
            src="${picture.src}"
            alt="${picture.alt}"
            srcset="${picture.srcset}"
            sizes="${picture.sizes}" />`
        : ''
      }
      <div class="LinkBlock-label">
        ${props.label}
      </div>
    </a>
  `
}
