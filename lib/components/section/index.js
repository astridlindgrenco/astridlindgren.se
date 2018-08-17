var html = require('nanohtml')
var palette = require('../base/palette')
var { className } = require('../base/utils')

module.exports = section
function section (data) {
  if (data.body) {
    var { body, header, footer, isFill, isFillSmall, isFillLarge, isNarrow, push, pushLarge, bg } = data
  } else {
    var body = data
  }
  var bgClassName = bg ? palette.getClassName(bg) : ''
  var classes = className('Section', {
    'Section--fill': isFill,
    'Section--fillSmall': isFillSmall,
    'Section--fillLarge': isFillLarge,
    'Section--narrow': isNarrow,
    'Section--marginVerSmall': push,
    'Section--marginVerLarge': pushLarge,
    'Section--hasBgColor': bg,
    [`u-bg${bgClassName}`]: bg,
    [`u-colorFor${bgClassName}`]: bg
  })
  return html`
    <div class="${classes}">
      <div class="Section-body">
        ${sectionHeader(header)}
        ${body}
        ${sectionFooter(footer)}
      </div>
    </div>
  `
}

function sectionHeader (content) {
  return content ? html`<div class="Section-header">${content}</div>` : ''
}

function sectionFooter (content) {
  return content ? html`<div class="Section-footer">${content}</div>` : ''
}
