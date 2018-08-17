var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = section
function section (data) {
  if (data.body) {
    var { body, header, footer, isFill, isFillSmall, isFillLarge, isNarrow, push, pushLarge } = data
  } else {
    var body = data
  }
  var classes = className('Section', {
    'Section--fill': isFill,
    'Section--fillSmall': isFillSmall,
    'Section--fillLarge': isFillLarge,
    'Section--narrow': isNarrow,
    'Section--marginVerSmall': push,
    'Section--marginVerLarge': pushLarge
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
