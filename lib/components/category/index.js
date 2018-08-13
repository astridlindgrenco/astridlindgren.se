var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = category
function category (text, divider) {
  return html`
    <div class="Category">
      <div class="Category-label">
        ${text}
      </div>
      <div class="Category-divider">${divider || html`&#8212;`}</div>
    </div>
  `
}
