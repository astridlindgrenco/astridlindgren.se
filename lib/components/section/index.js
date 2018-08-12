var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = section
function section (body) {
  if (body.body) {
    var { body, isFill, isFillSmall, isFillLarge, isNarrow, push, pushLarge } = body
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
        ${body}
      </div>
    </div>
  `
}
