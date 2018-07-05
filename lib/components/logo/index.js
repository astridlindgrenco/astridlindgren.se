var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = logo
function logo ({ alt, color, isFill }) {
  var classes = className('Logo', {
    'Logo--fill': isFill
  })
  return html`
    <img class="${classes}" src="assets/al_logo_${color || 'black'}.svg" alt="${alt}" />
  `
}
