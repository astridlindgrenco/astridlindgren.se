var html = require('nanohtml')

module.exports = header
function header (text) {
  return html`
    <header class="Header">
      <h1 style="color: red">${text}</h1>
    </header>
  `
}
