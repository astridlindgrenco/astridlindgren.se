var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = logo
function logo ({ alt, color, isFill, title, locale }) {
  var classes = className('Logo', {
    'Logo--fill': isFill
  })
  return html`
    <a href="/${locale}" title="${title}"><img class="${classes}" src="/al_logo_${color || 'black'}.svg" alt="${alt}" /></a>
  `
}
