var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = quote
function quote (body, cite) {
  return html`
    <div class="Quote">
      <div class="Quote-body">
        ${body}
      </div>
      <div class="Quote-cite">${cite}</div>
    </div>
  `
}
