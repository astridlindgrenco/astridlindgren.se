var html = require('nanohtml')
var { className, icon } = require('../base/utils')

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
  if (divider === 'default') divider = '/krumelur.svg'
  return html`
    <div class="Category-divider">
      ${divider ? getImage(divider) : ''}
    </div>`
}

function getImage (divider) {
  if (divider.endsWith('.svg')) return html`<img class="Category-icon" src="${divider}">`
  const img = icon(divider)
  return html`<img class="Category-icon" srcset="${img.srcset}" src="${img.src}">`
}
