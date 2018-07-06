var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = section
function section ({ body, isFill, push }) {
  var classes = className('Section', {
    'Section--fill': isFill,
    'Section--push': push,
  })
  return html`
    <div class="${classes}">
      <div class="Section-body">
        ${body}
      </div>
    </div>
  `
}
