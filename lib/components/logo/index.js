var html = require('nanohtml')

module.exports = logo
function logo ({ alt, color }) {
  return html`
    <img class="Logo Logo--company" src="assets/al_logo_${color || 'black'}.svg" alt="${alt}" />
  `
}
