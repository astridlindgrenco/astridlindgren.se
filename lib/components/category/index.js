var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = category
function category (text, divider = 'default') {
  if (!text) return
  var classes = className('Category', {
    'Category--noDivider': !divider
  })
  return html`
    <div class="${classes}">
      <div class="Category-label">${text}</div>
      ${divider ? categoryDivider(divider) : ''}
    </div>
  `
}

function categoryDivider (divider) {
  return html`<div class="Category-divider">${divider === 'default' ? /* html`&#8212;` */'' : html`<img class="Category-icon" src="${divider}"/>`}</div>`
}
