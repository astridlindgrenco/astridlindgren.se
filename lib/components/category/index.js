var html = require('nanohtml')
var { className, dividerImage } = require('../base/utils')

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
  if (!divider || divider === 'default') return
  return html`
    <div class="Category-divider">
      ${getDividerImage(divider)}
    </div>`
}

function getDividerImage (divider) {
  if (divider.endsWith('.svg')) return html`<img class="Category-icon" src="${divider}">`
  const img = dividerImage(divider)
  return html`<img class="Category-icon" srcset="${img.srcset}" sizes="${img.sizes}" src="${img.src}">`
}
