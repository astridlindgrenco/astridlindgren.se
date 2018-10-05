var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = category
function category (text, divider) {
  if (!text) return
  var classes = className('Category', {
    'Category--noDivider': !divider
  })
  return html`
    <div class="${classes}">
      <div class="Category-label">${text}</div>
      ${categoryDivider(divider)}
    </div>
  `
}

function categoryDivider (divider) {
  return html`<div class="Category-divider">${divider ? html`<img class="Category-icon" src="${divider}"/>` : ''}</div>`
}
